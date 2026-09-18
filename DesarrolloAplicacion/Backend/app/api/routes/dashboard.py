from fastapi import APIRouter
from schemas.medicionpunto import MedicionPunto
from models.errores import RecursoNoEncontradoError
from models.entradasensor import EntradaSensor
from database.mongodb import monitoreos_collection
from datetime import datetime


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/mediciones/{id_dispositivo}/{entrada}", response_model=list[MedicionPunto])
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
                    "fecha": -1
                }
            },
            {
                "$limit": 50
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

@router.get("/mediciones/{id_dispositivo}/{entrada}/{f_inicio}/{f_fin}", response_model=list[MedicionPunto])
def obtener_mediciones_entrada_fecha(id_dispositivo: str, entrada: EntradaSensor, f_inicio: datetime, f_fin: datetime):

    mediciones = list(
        monitoreos_collection.aggregate([
            {
                "$match": {
                    "IDDispositivo": id_dispositivo,
                    "FechaMonitoreo": {
                        "$gte": f_inicio,
                        "$lte": f_fin
                    }
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
            f"No hay mediciones de '{entrada.value}' para el dispositivo '{id_dispositivo}' en el rango de fechas `{f_inicio}`-`{f_fin}`."
        )

    return mediciones


@router.get("/promedio/{id_dispositivo}/{entrada}")
def obtener_promedio_entrada(id_dispositivo: str, entrada: EntradaSensor):

    resultado = list(
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
                "$group": {
                    "_id": None,
                    "promedio": {
                        "$avg": "$Mediciones.valor"
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "promedio": 1
                }
            }
        ])
    )

    if not resultado:
        return {
            "IDDispositivo": id_dispositivo,
            "entrada": entrada.value,
            "promedio": None
        }

    return {
        "IDDispositivo": id_dispositivo,
        "entrada": entrada.value,
        "promedio": resultado[0]["promedio"]
    }

@router.get("/promedio/{id_dispositivo}/{entrada}/{f_inicio}/{f_fin}")
def obtener_promedio_entrada_fecha(id_dispositivo: str, entrada: EntradaSensor, f_inicio: datetime, f_fin: datetime):

    resultado = list(
        monitoreos_collection.aggregate([
            {
                "$match": {
                    "IDDispositivo": id_dispositivo,
                    "FechaMonitoreo": {
                        "$gte": f_inicio,
                        "$lte": f_fin
                    }
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
                "$group": {
                    "_id": None,
                    "promedio": {
                        "$avg": "$Mediciones.valor"
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "promedio": 1
                }
            }
        ])
    )

    if not resultado:
        return {
            "IDDispositivo": id_dispositivo,
            "entrada": entrada.value,
            "promedio": None
        }

    return {
        "IDDispositivo": id_dispositivo,
        "entrada": entrada.value,
        "promedio": resultado[0]["promedio"]
    }

@router.get("/pulsos/{id_dispositivo}/{entrada}")
def obtener_pulsos_entrada(id_dispositivo: str, entrada: EntradaSensor):

    resultado = list(
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
                "$group": {
                    "_id": None,
                    "conteo_pulsaciones": {
                        "$sum": "$Mediciones.valor"
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "conteo_pulsaciones": 1
                }
            }
        ])
    )

    if not resultado:
        return {
            "IDDispositivo": id_dispositivo,
            "entrada": entrada.value,
            "total": None
        }

    return {
        "IDDispositivo": id_dispositivo,
        "entrada": entrada.value,
        "total": resultado[0]["conteo_pulsaciones"]
    }

@router.get("/pulsos/{id_dispositivo}/{entrada}/{f_inicio}/{f_fin}")
def obtener_pulsos_entrada_fecha(id_dispositivo: str, entrada: EntradaSensor, f_inicio: datetime, f_fin: datetime):

    resultado = list(
        monitoreos_collection.aggregate([
            {
                "$match": {
                    "IDDispositivo": id_dispositivo,
                    "FechaMonitoreo": {
                        "$gte": f_inicio,
                        "$lte": f_fin
                    }
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
                "$group": {
                    "_id": None,
                    "conteo_pulsaciones": {
                        "$sum": "$Mediciones.valor"
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "conteo_pulsaciones": 1
                }
            }
        ])
    )

    if not resultado:
        return {
            "IDDispositivo": id_dispositivo,
            "entrada": entrada.value,
            "total": None
        }

    return {
        "IDDispositivo": id_dispositivo,
        "entrada": entrada.value,
        "total": resultado[0]["conteo_pulsaciones"]
    }