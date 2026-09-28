from fastapi import APIRouter
from utils.validaciones import _validar_rango_fechas
from models.entradasensor import EntradaSensor
from models.errores import RecursoNoEncontradoError
from schemas.medicionpunto import MedicionPunto
from schemas.monitoreo import Monitoreo
from database.mongodb import monitoreos_collection
from datetime import datetime

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

@router.get("/{id_dispositivo}/{f_inicio}/{f_fin}", response_model=list[Monitoreo])
def obtener_monitoreos(
    id_dispositivo: str,
    f_inicio: datetime,
    f_fin: datetime
):

    _validar_rango_fechas(f_inicio, f_fin)
    
    monitoreos = list(
        monitoreos_collection.find({
            "IDDispositivo": id_dispositivo,
            "FechaMonitoreo": {
                "$gte": f_inicio,
                "$lte": f_fin
            }
        })
    )

    for monitoreo in monitoreos:
        monitoreo["_id"] = str(monitoreo["_id"])

    
    if not monitoreos:
        raise RecursoNoEncontradoError(
            f"No hay mediciones para el dispositivo '{id_dispositivo}'"
        )

    return monitoreos

# A diferencia del enpoint en dashboard extrae más de 50 registros para poder mostrarlos en la tabla
@router.get("/historico/{id_dispositivo}/{entrada}", response_model=list[MedicionPunto])
def obtener_historial_entrada(id_dispositivo: str, entrada: EntradaSensor):

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
                    "Mediciones.entrada": entrada.value
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

    if not mediciones:
        raise RecursoNoEncontradoError(
            f"No hay mediciones de '{entrada.value}' para el dispositivo '{id_dispositivo}'"
        )

    return mediciones