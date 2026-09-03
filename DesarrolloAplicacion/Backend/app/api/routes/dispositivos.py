from fastapi import APIRouter
from database.mongodb import monitoreos_collection


router = APIRouter(
    prefix="/api/dispositivos",
    tags=["Dispositivos"]
)


@router.get("/")
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

