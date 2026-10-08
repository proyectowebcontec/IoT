import logging
import queue
import signal
import threading
import time
from datetime import datetime
from uuid import uuid4

import paho.mqtt.client as mqtt
from pydantic import ValidationError

from .configure import BROKER, PORT, TOPIC, CLIENT_ID
from ..database.mongodb import monitoreos_collection
from ..schemas.gateway151 import GatewayData
from ..schemas.monitoreo import Medicion, Monitoreo
from ..alarms import AlarmService

# --------------------------------------
# Configuración
# --------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(threadName)s: %(message)s",
)
log = logging.getLogger("whg151")

ID_DISPOSITIVO = "WHG-151-001"
QOS = 1                      # Garantiza al menos una entrega
MAX_COLA = 10_000            # Mensajes en espera antes de descartar
TAMANO_LOTE = 50             # Documentos por insert_many
TIEMPO_LOTE = 0.5            # Segundos máximos antes de vaciar un lote
FORMATO_FECHA = "%Y-%m-%d %H:%M:%S"

# Constantes calculadas una sola vez (antes se recreaban en cada iteración)
ENTRADAS_CONVERTIR = frozenset(f"U{i}" for i in range(1, 9))

DESCRIPCIONES = {
    **{f"U{i}": f"Voltaje U{i}" for i in range(1, 9)},
    **{f"I{i}": f"Corriente I{i}" for i in range(1, 9)},
    **{f"C{i}": f"Contador C{i}" for i in range(1, 3)},
    **{f"F{i}": f"Frecuencia F{i}" for i in range(1, 3)},
    **{f"AO{i}": f"Salida analógica AO{i}" for i in range(1, 3)},
    **{f"DI{i}": f"Entrada digital DI{i}" for i in range(1, 9)},
    **{f"DO{i}": f"Salida digital DO{i}" for i in range(1, 5)},
    "S": "Sensor S",
}

# --------------------------------------
# Estado compartido
# --------------------------------------

cola_mensajes: "queue.Queue[bytes]" = queue.Queue(maxsize=MAX_COLA)
cola_alarmas: "queue.Queue[Monitoreo]" = queue.Queue(maxsize=MAX_COLA)
detener = threading.Event()
alarm_service = AlarmService()

estadisticas = {"recibidos": 0, "guardados": 0, "descartados": 0, "errores": 0}
lock_stats = threading.Lock()


def sumar(clave: str, n: int = 1) -> None:
    with lock_stats:
        estadisticas[clave] += n


# --------------------------------------
# Transformación (CPU, sin I/O)
# --------------------------------------

def construir_monitoreo(data: GatewayData) -> Monitoreo:
    #fecha_gateway = datetime.strptime(data.times, FORMATO_FECHA)
    mediciones = []

    for indice, sensor in enumerate(data.sensorDatas, start=1):
        entrada = sensor.flag

        if sensor.value is not None:
            v = float(sensor.value)
            valor = ((v - 0.8) * 2.1 / 0.28) + 6.2 if entrada in ENTRADAS_CONVERTIR else v
        elif sensor.switcher is not None:
            valor = sensor.switcher
        else:
            continue  # Sin valor útil

        mediciones.append(
            Medicion(
                IdMedicion=indice,
                descripcion=DESCRIPCIONES.get(entrada, f"Entrada {entrada}"),
                entrada=entrada,
                valor=valor,
            )
        )

    return Monitoreo(
        IDMonitoreo=str(uuid4()),
        IDDispositivo=ID_DISPOSITIVO,
        FechaMonitoreo=datetime.now(),
        FechaCargaDB=datetime.now(),
        Mediciones=mediciones,
    )


# --------------------------------------
# Worker 1: parseo + inserción por lotes
# --------------------------------------

def guardar_lote(lote: list[Monitoreo]) -> None:
    if not lote:
        return
    try:
        monitoreos_collection.insert_many(
            [m.model_dump() for m in lote],
            ordered=False,  # Un documento fallido no detiene al resto
        )
        sumar("guardados", len(lote))
    except Exception:
        sumar("errores", len(lote))
        log.exception("Error al guardar lote de %d monitoreos", len(lote))
        return

    for m in lote:
        try:
            cola_alarmas.put_nowait(m)
        except queue.Full:
            log.warning("Cola de alarmas llena; alarma omitida para %s", m.IDMonitoreo)


def worker_persistencia() -> None:
    lote: list[Monitoreo] = []
    limite = time.monotonic() + TIEMPO_LOTE

    while not (detener.is_set() and cola_mensajes.empty()):
        espera = max(0.0, limite - time.monotonic())
        try:
            payload = cola_mensajes.get(timeout=espera)
        except queue.Empty:
            payload = None

        if payload is not None:
            try:
                # Pydantic parsea JSON directamente: más rápido que json.loads + **dict
                data = GatewayData.model_validate_json(payload)
                lote.append(construir_monitoreo(data))
            except ValidationError as e:
                sumar("errores")
                log.warning("Mensaje inválido descartado: %s", e.errors()[:1])
            except Exception:
                sumar("errores")
                log.exception("Error procesando mensaje")
            finally:
                cola_mensajes.task_done()

        if len(lote) >= TAMANO_LOTE or time.monotonic() >= limite:
            guardar_lote(lote)
            lote = []
            limite = time.monotonic() + TIEMPO_LOTE

    guardar_lote(lote)  # Vaciar lo pendiente al apagar
    log.info("Worker de persistencia finalizado")


# --------------------------------------
# Worker 2: alarmas (no bloquea la inserción)
# --------------------------------------

def worker_alarmas() -> None:
    while not (detener.is_set() and cola_alarmas.empty()):
        try:
            monitoreo = cola_alarmas.get(timeout=0.5)
        except queue.Empty:
            continue
        try:
            alarm_service.evaluate(monitoreo)
        except Exception:
            log.exception("Error evaluando alarmas de %s", monitoreo.IDMonitoreo)
        finally:
            cola_alarmas.task_done()
    log.info("Worker de alarmas finalizado")


# --------------------------------------
# Callbacks MQTT (paho-mqtt 2.x, deben ser mínimos)
# --------------------------------------

def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code == 0:
        log.info("Conectado al broker MQTT")
        client.subscribe(TOPIC, qos=QOS)  # Se re-suscribe en cada reconexión
    else:
        log.error("Fallo de conexión: %s", reason_code)


def on_message(client, userdata, msg):
    # Solo encolar: nada de parseo, base de datos ni prints aquí
    sumar("recibidos")
    try:
        cola_mensajes.put_nowait(msg.payload)
    except queue.Full:
        sumar("descartados")


def on_disconnect(client, userdata, flags, reason_code, properties):
    if reason_code != 0:
        log.warning("Desconexión inesperada (%s); reconectando...", reason_code)
    else:
        log.info("Desconectado del broker")


# --------------------------------------
# Main
# --------------------------------------

def main() -> None:
    hilos = [
        threading.Thread(target=worker_persistencia, name="persistencia", daemon=True),
        threading.Thread(target=worker_alarmas, name="alarmas", daemon=True),
    ]
    for h in hilos:
        h.start()

    client = mqtt.Client(
        mqtt.CallbackAPIVersion.VERSION2,
        client_id=CLIENT_ID,
        clean_session=False,  # El broker guarda mensajes QoS 1 durante cortes breves
    )
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect
    client.reconnect_delay_set(min_delay=1, max_delay=30)
    client.max_inflight_messages_set(100)

    signal.signal(signal.SIGTERM, lambda *_: detener.set())

    try:
        client.connect(BROKER, PORT, keepalive=60)
        client.loop_start()

        ultimo = dict(estadisticas)
        while not detener.wait(10):
            with lock_stats:
                actual = dict(estadisticas)
            tasa = (actual["recibidos"] - ultimo["recibidos"]) / 10
            log.info(
                "%.1f msg/s | cola=%d | guardados=%d | descartados=%d | errores=%d",
                tasa, cola_mensajes.qsize(), actual["guardados"],
                actual["descartados"], actual["errores"],
            )
            ultimo = actual

    except KeyboardInterrupt:
        log.info("Interrumpido por el usuario")
    except Exception:
        log.exception("Error fatal")
    finally:
        detener.set()
        client.loop_stop()
        client.disconnect()
        for h in hilos:
            h.join(timeout=10)
        log.info("Finalizado: %s", estadisticas)


if __name__ == "__main__":
    main()