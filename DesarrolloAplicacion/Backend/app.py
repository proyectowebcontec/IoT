import paho.mqtt.client as mqtt
import time
import sys
import json
import config as config
from datetime import datetime
from uuid import uuid4

from pymongo import MongoClient

ID_DISPOSITIVO = "WHG-151-001"

# Descrptions
DESCRIPCIONES = {
    "U1": "Voltaje U1",
    "U2": "Voltaje U2",
    "U3": "Voltaje U3",
    "U4": "Voltaje U4",
    "U5": "Voltaje U5",
    "U6": "Voltaje U6",
    "U7": "Voltaje U7",
    "U8": "Voltaje U8",

    "I1": "Corriente I1",
    "I2": "Corriente I2",
    "I3": "Corriente I3",
    "I4": "Corriente I4",
    "I5": "Corriente I5",
    "I6": "Corriente I6",
    "I7": "Corriente I7",
    "I8": "Corriente I8",

    "C1": "Contador C1",
    "C2": "Contador C2",

    "F1": "Frecuencia F1",
    "F2": "Frecuencia F2",

    "AO1": "Salida analógica AO1",
    "AO2": "Salida analógica AO2",

    "DI1": "Entrada digital DI1",
    "DI2": "Entrada digital DI2",
    "DI3": "Entrada digital DI3",
    "DI4": "Entrada digital DI4",
    "DI5": "Entrada digital DI5",
    "DI6": "Entrada digital DI6",
    "DI7": "Entrada digital DI7",
    "DI8": "Entrada digital DI8",

    "DO1": "Salida digital DO1",
    "DO2": "Salida digital DO2",
    "DO3": "Salida digital DO3",
    "DO4": "Salida digital DO4",

    "S": "Sensor S"
}

# MONGODB
def get_db_connection():
    mongo_client = MongoClient(config.MONGO_URI)
    db = mongo_client[config.DATABASE_NAME]
    collection = db[config.COLLECTION_NAME]

    return collection

# Save meassures
def guardar_monitoreo(data):

    # --------------------------------------
    # Timestamp del gateway
    # --------------------------------------

    fecha_gateway = datetime.strptime(
        data["times"],
        "%Y-%m-%d %H:%M:%S"
    )

    # --------------------------------------
    # Timestamp de carga
    # --------------------------------------

    fecha_carga = datetime.now()

    # --------------------------------------
    # Mediciones
    # --------------------------------------

    mediciones = []

    for indice, sensor in enumerate(
        data["sensorDatas"],
        start=1
    ):

        entrada = sensor["flag"]

        if "value" in sensor:
            valor = sensor["value"]

        elif "switcher" in sensor:
            valor = sensor["switcher"]

        else:
            valor = None

        mediciones.append({
            "IdMedicion": indice,
            "descripcion": DESCRIPCIONES.get(
                entrada,
                f"Entrada {entrada}"
            ),
            "entrada": entrada,
            "valor": valor
        })

    # --------------------------------------
    # Documento
    # --------------------------------------

    documento = {

        "IDMonitoreo": str(uuid4()),

        "IDDispositivo": ID_DISPOSITIVO,

        "FechaMonitoreo": fecha_gateway,

        "FechaCargaDB": fecha_carga,

        "Mediciones": mediciones
    }

    # --------------------------------------
    # Guardar
    # --------------------------------------
    collection = get_db_connection()

    collection.insert_one(documento)

    print(
        f"Monitoreo almacenado: "
        f"{documento['IDMonitoreo']}"
    )

# Callback when the client connect to the broker
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker!")
        client.subscribe(config.TOPIC)
    else:
        print(f"Failed to connect, return codem {rc}")

# Callback when a message is received from the broker
def on_message(client, userdata, msg):
    str_msg = msg.payload.decode()
    #print(f"Received message: {str_msg} on topic {config.TOPIC}")
    #print(type(msg.payload.decode()))

    try:
        # Parse JSON string into Python object
        json_msg = json.loads(str_msg)
        #print(json_msg["times"])
        #print(json_msg["sensorDatas"][1])

        guardar_monitoreo(json_msg)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON string: {e}")

# Callback when the client disconnects
def on_disconnet(client, userdata, rc):
    print("Disconnected from broker")

def main():
    try:
        client = mqtt.Client(client_id=config.CLIENT_ID, clean_session=True)

        client.on_connect = on_connect
        client.on_message = on_message
        client.on_disconnect = on_disconnet

        # Connect to broker
        client.connect(config.BROKER, config.PORT, keepalive=60)

        client.loop_start()

        while True:
            print("Escuchando")
            time.sleep(5)

    except KeyboardInterrupt:
        print("\n Interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
    finally:
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    main()