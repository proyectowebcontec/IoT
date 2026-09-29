"""Cliente Twilio para el envio de notificaciones SMS.

El cliente se crea de forma diferida. Importar este modulo nunca envia un SMS y
las credenciales solo se validan cuando realmente se intenta notificar.
"""

from dataclasses import dataclass
from typing import Any

from ..Subscriber.configure import (
    TWILIO_FROM_PHONE,
    TWILIO_SID,
    TWILIO_TO_PHONE,
    TWILIO_TOKEN,
)


class TwilioConfigurationError(RuntimeError):
    """La configuracion necesaria para utilizar Twilio esta incompleta."""


@dataclass(frozen=True)
class SentMessage:
    sid: str
    status: str | None
    to: str


class TwilioService:
    def __init__(
        self,
        account_sid: str | None = TWILIO_SID,
        auth_token: str | None = TWILIO_TOKEN,
        from_phone: str | None = TWILIO_FROM_PHONE,
        default_to_phone: str | None = TWILIO_TO_PHONE,
        client: Any | None = None,
    ) -> None:
        self.account_sid = account_sid
        self.auth_token = auth_token
        self.from_phone = from_phone
        self.default_to_phone = default_to_phone
        self._client = client

    def _get_client(self) -> Any:
        if self._client is not None:
            return self._client

        missing = [
            name
            for name, value in (
                ("TWILIO_SID", self.account_sid),
                ("TWILIO_TOKEN", self.auth_token),
                ("TWILIO_FROM_PHONE", self.from_phone),
            )
            if not value
        ]
        if missing:
            raise TwilioConfigurationError(
                f"Faltan variables de entorno de Twilio: {', '.join(missing)}"
            )

        try:
            from twilio.rest import Client
        except ImportError as exc:
            raise TwilioConfigurationError(
                "El paquete 'twilio' no esta instalado. Ejecute: pip install twilio"
            ) from exc

        self._client = Client(self.account_sid, self.auth_token)
        return self._client

    def send_sms(self, body: str, to_phone: str | None = None) -> SentMessage:
        destination = to_phone or self.default_to_phone
        if not destination:
            raise TwilioConfigurationError(
                "No se definio destinatario; configure TWILIO_TO_PHONE o paselo en la regla."
            )
        if not body.strip():
            raise ValueError("El mensaje SMS no puede estar vacio.")

        message = self._get_client().messages.create(
            body=body,
            from_=self.from_phone,
            to=destination,
        )
        return SentMessage(
            sid=message.sid,
            status=getattr(message, "status", None),
            to=destination,
        )
