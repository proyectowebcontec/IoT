from fastapi import APIRouter
from models.errores import RecursoNoEncontradoError
from schemas.dispositivos import DispositivoResumen
from database.mongodb import dispositivos_collection


router = APIRouter(
    prefix="/api/dispositivos",
    tags=["Dispositivos"]
)


@router.get("/", response_model=list[DispositivoResumen])
def obtener_dispositivos():

    dispositivos = list(
        dispositivos_collection.find({}, {"empresa_id": 0, "canales": 0, "firmware": 0})
    )

    if not dispositivos:
        raise RecursoNoEncontradoError(
            f"No hay dispositivos registrados."
        )

    return dispositivos

@router.get("/count")
def obtener_count_dispositivos():

    resultado = list(
        dispositivos_collection.aggregate([
            {
                "$group": {
                    "_id": "$_id"
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

