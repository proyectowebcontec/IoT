from fastapi import APIRouter, HTTPException
from config import TWILIO_FROM_PHONE, TWILIO_SID, TWILIO_TOKEN
from twilio.rest import Client
from utils.validaciones import _validar_numero_telefono

router = APIRouter(
    prefix="/api/alarmas",
    tags=["Alarmas"]
)

@router.post("/sms/{numero_destino}")
def enviar_sms(numero_destino: str):

    _validar_numero_telefono(numero_destino)

    client = Client(
        TWILIO_SID,
        TWILIO_TOKEN
    )

    if not numero_destino.startswith("+502"):
        numero_destino = "+502" + numero_destino
    elif numero_destino.startswith("502"):
        numero_destino = "+" + numero_destino

    try:
        mensaje = client.messages.create(
            body="Alerta: se ha detectado una condición que requiere atención.",
            from_=TWILIO_FROM_PHONE,
            to=numero_destino
        )

        return {
            "mensaje": "SMS enviado correctamente",
            "destino": numero_destino
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al enviar SMS: {str(e)}"
        )