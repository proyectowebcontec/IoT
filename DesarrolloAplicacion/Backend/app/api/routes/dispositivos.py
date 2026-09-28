from fastapi import APIRouter
from models.errores import RecursoNoEncontradoError
from schemas.dispositivos import Dispositivo
from database.mongodb import monitoreos_collection


router = APIRouter(
    prefix="/api/dispositivos",
    tags=["Dispositivos"]
)


@router.get("/", response_model=list[Dispositivo])
def obtener_dispositivos():

    dispositivos = list(
        monitoreos_collection.aggregate([
            {
                "$group": {
                    "_id": "$IDDispositivo"
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "IDDispositivo": "$_id"
                }
            }
        ])
    )

    if not dispositivos:
        raise RecursoNoEncontradoError(
            f"No hay dispositivos registrados."
        )

    return dispositivos

@router.get("/count")
def obtener_count_dispositivos():

    resultado = list(
        monitoreos_collection.aggregate([
            {
                "$group": {
                    "_id": "$IDDispositivo"
                }
            },
            {
                "$count": "total_dispositivos"
            }
        ])
    )

    total = resultado[0]["total_dispositivos"] if resultado else 0

    return {
        "totalDispositivos": total
    }

