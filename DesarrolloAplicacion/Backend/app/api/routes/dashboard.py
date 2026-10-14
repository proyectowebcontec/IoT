from datetime import datetime

from fastapi import APIRouter

from database.mongodb import dispositivos_collection, monitoreos_collection
from models.entradasensor import EntradaSensor
from models.errores import RecursoNoEncontradoError
from schemas.medicionpunto import MedicionPunto
from schemas.responses import PromedioResponse, PulsosResponse
from utils.validaciones import _validar_rango_fechas

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


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


# ---------------------------------------------------------------------------
# Mediciones
# ---------------------------------------------------------------------------
@router.get("/mediciones/{id_dispositivo}/{entrada}", response_model=list[MedicionPunto])
def obtener_historial_entrada(id_dispositivo: str, entrada: EntradaSensor):

    canal_id = _resolver_canal_id(id_dispositivo, entrada)
    mediciones = _puntos_canal(id_dispositivo, canal_id, ultimos=50)

    if not mediciones:
        raise RecursoNoEncontradoError(
            f"No hay mediciones de '{entrada.value}' para el dispositivo '{id_dispositivo}'"
        )

    return mediciones


@router.get("/mediciones/{id_dispositivo}/{entrada}/{f_inicio}/{f_fin}", response_model=list[MedicionPunto])
def obtener_mediciones_entrada_fecha(
    id_dispositivo: str, entrada: EntradaSensor, f_inicio: datetime, f_fin: datetime
):

    _validar_rango_fechas(f_inicio, f_fin)

    canal_id = _resolver_canal_id(id_dispositivo, entrada)
    mediciones = _puntos_canal(id_dispositivo, canal_id, desde=f_inicio, hasta=f_fin)

    if not mediciones:
        raise RecursoNoEncontradoError(
            f"No hay mediciones de '{entrada.value}' para el dispositivo '{id_dispositivo}' "
            f"en el rango de fechas `{f_inicio}`-`{f_fin}`."
        )

    return mediciones


# ---------------------------------------------------------------------------
# Promedio
# ---------------------------------------------------------------------------
@router.get("/promedio/{id_dispositivo}/{entrada}", response_model=PromedioResponse)
def obtener_promedio_entrada(id_dispositivo: str, entrada: EntradaSensor):

    canal_id = _resolver_canal_id(id_dispositivo, entrada)
    promedio = _agregar_canal(id_dispositivo, canal_id, "$avg")

    if promedio is None:
        raise RecursoNoEncontradoError(
            f"No hay mediciones de '{entrada.value}' "
            f"para el dispositivo '{id_dispositivo}'"
        )

    return PromedioResponse(
        IDDispositivo=id_dispositivo,
        entrada=entrada,
        promedio=promedio
    )


@router.get("/promedio/{id_dispositivo}/{entrada}/{f_inicio}/{f_fin}", response_model=PromedioResponse)
def obtener_promedio_entrada_fecha(
    id_dispositivo: str, entrada: EntradaSensor, f_inicio: datetime, f_fin: datetime
):

    _validar_rango_fechas(f_inicio, f_fin)

    canal_id = _resolver_canal_id(id_dispositivo, entrada)
    promedio = _agregar_canal(id_dispositivo, canal_id, "$avg", f_inicio, f_fin)

    if promedio is None:
        raise RecursoNoEncontradoError(
            f"No hay mediciones de '{entrada.value}' "
            f"para el dispositivo '{id_dispositivo}' "
            f"entre '{f_inicio}' y '{f_fin}'"
        )

    return PromedioResponse(
        IDDispositivo=id_dispositivo,
        entrada=entrada,
        promedio=promedio
    )


# ---------------------------------------------------------------------------
# Pulsos
# ---------------------------------------------------------------------------
@router.get("/pulsos/{id_dispositivo}/{entrada}", response_model=PulsosResponse)
def obtener_pulsos_entrada(id_dispositivo: str, entrada: EntradaSensor):

    canal_id = _resolver_canal_id(id_dispositivo, entrada)
    total = _agregar_canal(id_dispositivo, canal_id, "$sum")

    if total is None:
        raise RecursoNoEncontradoError(
            f"No hay pulsos de '{entrada.value}' "
            f"para el dispositivo '{id_dispositivo}'"
        )

    return PulsosResponse(
        IDDispositivo=id_dispositivo,
        entrada=entrada,
        total=total
    )


@router.get("/pulsos/{id_dispositivo}/{entrada}/{f_inicio}/{f_fin}", response_model=PulsosResponse)
def obtener_pulsos_entrada_fecha(
    id_dispositivo: str, entrada: EntradaSensor, f_inicio: datetime, f_fin: datetime
):

    # Corregido: antes validaba (f_fin, f_fin), por lo que nunca detectaba
    # un rango invertido
    _validar_rango_fechas(f_inicio, f_fin)

    canal_id = _resolver_canal_id(id_dispositivo, entrada)
    total = _agregar_canal(id_dispositivo, canal_id, "$sum", f_inicio, f_fin)

    if total is None:
        raise RecursoNoEncontradoError(
            f"No hay pulsos de '{entrada.value}' "
            f"para el dispositivo '{id_dispositivo}' "
            f"entre '{f_inicio}' y '{f_fin}'"
        )

    return PulsosResponse(
        IDDispositivo=id_dispositivo,
        entrada=entrada,
        total=total
    )