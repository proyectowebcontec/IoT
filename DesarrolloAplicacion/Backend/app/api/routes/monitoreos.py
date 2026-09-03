from fastapi import APIRouter
from database.mongodb import monitoreos_collection


router = APIRouter(
    prefix="/api/monitoreos",
    tags=["Monitoreos"]
)


@router.get("/")
def obtener_monitoreos():

    monitoreos = list(
        monitoreos_collection.find({}, {"IDMonitoreo": 1, "IDDispositivo": 1, "FechaMonitoreo": 1, "FechaCargaDB": 1})
    )

    # MongoDB utiliza ObjectId, que no se puede
    # serializar directamente a JSON
    for monitoreo in monitoreos:
        monitoreo["_id"] = str(monitoreo["_id"])

    return monitoreos

@router.get("/count")
def obtener_count_monitoreos():

    monitoreos = list(
        monitoreos_collection.find({}, {"IDMonitoreo": 1, "IDDispositivo": 1, "FechaMonitoreo": 1, "FechaCargaDB": 1})
    )

    total = len(monitoreos)
    
    return {
        "total_monitoreos": total
    }

@router.get("/historico/{id_dispositivo}/{entrada}")
def obtener_historial_entrada(id_dispositivo: str, entrada: str):

    mediciones = list(
        monitoreos_collection.aggregate([
            {
                "$match": {
                    "IDDispositivo": id_dispositivo
                }
            },
            {
                "$unwind": "$Mediciones"
            },
            {
                "$match": {
                    "Mediciones.entrada": entrada
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "fecha": "$FechaMonitoreo",
                    "valor": "$Mediciones.valor"
                }
            },
            {
                "$sort": {
                    "fecha": 1
                }
            }
        ])
    )

    return mediciones