from fastapi import APIRouter
from database.mongodb import monitoreos_collection
from datetime import datetime


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/mediciones/{id_dispositivo}/{entrada}")
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

    return mediciones

@router.get("/mediciones/{id_dispositivo}/{entrada}/{f_inicio}/{f_fin}")
def obtener_mediciones_entrada_fecha(id_dispositivo: str, entrada: str, f_inicio: datetime, f_fin: datetime):

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


@router.get("/promedio/{id_dispositivo}/{entrada}")
def obtener_promedio_entrada(id_dispositivo: str, entrada: str):

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
                    "Mediciones.entrada": entrada
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
            "entrada": entrada,
            "promedio": None
        }

    return {
        "IDDispositivo": id_dispositivo,
        "entrada": entrada,
        "promedio": resultado[0]["promedio"]
    }

@router.get("/promedio/{id_dispositivo}/{entrada}/{f_inicio}/{f_fin}")
def obtener_promedio_entrada_fecha(id_dispositivo: str, entrada: str, f_inicio: datetime, f_fin: datetime):

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
                    "Mediciones.entrada": entrada
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
            "entrada": entrada,
            "promedio": None
        }

    return {
        "IDDispositivo": id_dispositivo,
        "entrada": entrada,
        "promedio": resultado[0]["promedio"]
    }

@router.get("/pulsos/{id_dispositivo}/{entrada}")
def obtener_pulsos_entrada(id_dispositivo: str, entrada: str):

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
                    "Mediciones.entrada": entrada
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
            "entrada": entrada,
            "total": None
        }

    return {
        "IDDispositivo": id_dispositivo,
        "entrada": entrada,
        "total": resultado[0]["conteo_pulsaciones"]
    }

@router.get("/pulsos/{id_dispositivo}/{entrada}/{f_inicio}/{f_fin}")
def obtener_pulsos_entrada_fecha(id_dispositivo: str, entrada: str, f_inicio: datetime, f_fin: datetime):

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
                    "Mediciones.entrada": entrada
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
            "entrada": entrada,
            "total": None
        }

    return {
        "IDDispositivo": id_dispositivo,
        "entrada": entrada,
        "total": resultado[0]["conteo_pulsaciones"]
    }