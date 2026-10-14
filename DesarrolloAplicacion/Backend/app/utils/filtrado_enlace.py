from datetime import datetime
from database.mongodb import dispositivos_collection, monitoreos_collection
from models.errores import RecursoNoEncontradoError
from models.entradasensor import EntradaSensor

# ---------------------------------------------------------------------------
# Utilidades
# ---------------------------------------------------------------------------
def _obtener_catalogo(id_dispositivo: str) -> dict[int, dict]:
    """
    Devuelve el catálogo de canales del dispositivo indexado por id de canal:
    { 1: {"descripcion": ..., "entrada": ..., "unidad": ...}, ... }
    """
    dispositivo = dispositivos_collection.find_one(
        {"_id": id_dispositivo}, {"canales": 1}
    )
    if dispositivo is None:
        raise RecursoNoEncontradoError(
            f"No existe el dispositivo '{id_dispositivo}'"
        )
    return {
        c["id"]: {
            "descripcion": c.get("descripcion"),
            "entrada": c.get("entrada"),
            "unidad": c.get("unidad"),
        }
        for c in dispositivo.get("canales", [])
    }


def _filtro_fechas(desde: datetime | None, hasta: datetime | None) -> dict:
    rango = {}
    if desde:
        rango["$gte"] = desde
    if hasta:
        rango["$lte"] = hasta
    return {"fecha_monitoreo": rango} if rango else {}

# ---------------------------------------------------------------------------
# Utilidades compartidas
# ---------------------------------------------------------------------------
def _resolver_canal_id(id_dispositivo: str, entrada: EntradaSensor) -> int:
    """
    En los monitoreos solo se guarda el id del canal; el nombre de la entrada
    ("U0", etc.) vive en el catálogo del dispositivo. Aquí se traduce.
    """
    dispositivo = dispositivos_collection.find_one(
        {"_id": id_dispositivo}, {"canales": 1}
    )
    if dispositivo is None:
        raise RecursoNoEncontradoError(
            f"No existe el dispositivo '{id_dispositivo}'"
        )

    for canal in dispositivo.get("canales", []):
        if canal.get("entrada") == entrada.value:
            return canal["id"]

    raise RecursoNoEncontradoError(
        f"El dispositivo '{id_dispositivo}' no tiene la entrada '{entrada.value}'"
    )


def _etapa_match(
    id_dispositivo: str,
    desde: datetime | None = None,
    hasta: datetime | None = None,
) -> dict:
    filtro = {"meta.dispositivo_id": id_dispositivo}
    rango = {}
    if desde:
        rango["$gte"] = desde
    if hasta:
        rango["$lte"] = hasta
    if rango:
        filtro["fecha_monitoreo"] = rango
    return {"$match": filtro}


def _agregar_canal(
    id_dispositivo: str,
    canal_id: int,
    operador: str,                       # "$avg" o "$sum"
    desde: datetime | None = None,
    hasta: datetime | None = None,
):
    """
    Aplica un acumulador ($avg, $sum) sobre los valores de un canal.
    Devuelve el resultado o None si no hay mediciones.
    """
    resultado = list(
        monitoreos_collection.aggregate([
            _etapa_match(id_dispositivo, desde, hasta),
            {"$unwind": "$mediciones"},
            {"$match": {"mediciones.canal": canal_id}},
            {"$group": {"_id": None, "resultado": {operador: "$mediciones.valor"}}},
        ])
    )
    return resultado[0]["resultado"] if resultado else None


def _puntos_canal(
    id_dispositivo: str,
    canal_id: int,
    desde: datetime | None = None,
    hasta: datetime | None = None,
    ultimos: int | None = None,
):
    """Serie (fecha, valor) de un canal, en orden cronológico."""
    pipeline = [_etapa_match(id_dispositivo, desde, hasta)]

    if ultimos:
        # Cada documento trae una medición por canal, así que limitar los
        # documentos ANTES del unwind equivale a limitar los puntos
        # y evita desenrollar toda la colección.
        pipeline += [
            {"$sort": {"fecha_monitoreo": -1}},
            {"$limit": ultimos},
        ]

    pipeline += [
        {"$unwind": "$mediciones"},
        {"$match": {"mediciones.canal": canal_id}},
        {"$project": {
            "_id": 0,
            "fecha": "$fecha_monitoreo",
            "valor": "$mediciones.valor",
        }},
        {"$sort": {"fecha": 1}},
    ]
    return list(monitoreos_collection.aggregate(pipeline))

