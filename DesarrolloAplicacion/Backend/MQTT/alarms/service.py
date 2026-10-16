"""Orquestacion de alarmas sin bloquear el suscriptor MQTT."""

import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from queue import Queue
from threading import Lock, Thread
from time import monotonic
from typing import Any

from .rules import get_active_rules, rule_matches
from .twilio_service import TwilioService

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class AlarmNotification:
    device_id: str
    input_name: str
    description: str
    value: float | int
    operator: str
    threshold: float | int
    destination: str | None = None

    def message(self) -> str:
        timestamp = datetime.now(timezone.utc).astimezone().strftime("%Y-%m-%d %H:%M:%S %Z")
        return (
            f"ALARMA IoT - {self.device_id}\n"
            f"{self.description} ({self.input_name}): {self.value} "
            f"{self.operator} {self.threshold}\n"
            f"Fecha: {timestamp}"
        )


class AlarmService:
    """Evalua reglas y delega los envios a un worker en segundo plano."""

    def __init__(
        self,
        twilio_service: TwilioService | None = None,
        default_cooldown_seconds: int = 300,
        queue_size: int = 1000,
    ) -> None:
        self.twilio_service = twilio_service or TwilioService()
        self.default_cooldown_seconds = default_cooldown_seconds
        self._queue: Queue[AlarmNotification | None] = Queue(maxsize=queue_size)
        self._last_notification: dict[str, float] = {}
        self._state_lock = Lock()
        self._worker: Thread | None = None

    def start(self) -> None:
        if self._worker is not None and self._worker.is_alive():
            return
        self._worker = Thread(
            target=self._notification_worker,
            name="twilio-notification-worker",
            daemon=True,
        )
        self._worker.start()

    def stop(self, wait: bool = True) -> None:
        if self._worker is None:
            return
        self._queue.put(None)
        if wait:
            self._worker.join()
        self._worker = None

    def evaluate(self, monitoring: Any) -> int:
        """Evalua un ``Monitoreo`` y retorna cuantas alertas puso en cola."""
        measurements = getattr(monitoring, "Mediciones", None)
        device_id = getattr(monitoring, "IDDispositivo", None)
        if not device_id or measurements is None:
            raise ValueError("El monitoreo no contiene IDDispositivo o Mediciones.")

        by_input = {item.entrada: item for item in measurements}
        rules = get_active_rules(device_id, by_input.keys())
        queued = 0

        for rule in rules:
            measurement = by_input.get(rule.get("entrada"))
            if measurement is None:
                continue

            try:
                matched = rule_matches(rule, measurement.valor)
            except ValueError:
                logger.exception("Regla de alarma invalida: %s", rule.get("_id"))
                continue

            if not matched or not self._cooldown_elapsed(rule):
                continue

            notification = AlarmNotification(
                device_id=device_id,
                input_name=measurement.entrada,
                description=measurement.descripcion,
                value=measurement.valor,
                operator=str(rule["operador"]),
                threshold=rule["umbral"],
                destination=rule.get("destinatario"),
            )
            self.start()
            self._queue.put_nowait(notification)
            self._mark_notified(rule)
            queued += 1

        return queued

    def _rule_key(self, rule: dict[str, Any]) -> str:
        return str(rule.get("_id") or (
            rule.get("dispositivo"),
            rule.get("entrada"),
            rule.get("operador"),
            rule.get("umbral"),
        ))

    def _cooldown_elapsed(self, rule: dict[str, Any]) -> bool:
        cooldown = max(
            0,
            int(rule.get("cooldown_segundos", self.default_cooldown_seconds)),
        )
        with self._state_lock:
            last_sent = self._last_notification.get(self._rule_key(rule))
        return last_sent is None or monotonic() - last_sent >= cooldown

    def _mark_notified(self, rule: dict[str, Any]) -> None:
        with self._state_lock:
            self._last_notification[self._rule_key(rule)] = monotonic()

    def _notification_worker(self) -> None:
        while True:
            notification = self._queue.get()
            try:
                if notification is None:
                    return
                sent = self.twilio_service.send_sms(
                    notification.message(),
                    notification.destination,
                )
                logger.info("SMS de alarma enviado. Twilio SID: %s", sent.sid)
            except Exception:
                logger.exception("No fue posible enviar la alarma por Twilio.")
            finally:
                self._queue.task_done()
