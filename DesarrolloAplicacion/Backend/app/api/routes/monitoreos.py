from datetime import datetime

from fastapi import APIRouter, Query

from database.mongodb import dispositivos_collection, monitoreos_collection
from models.entradasensor import EntradaSensor
from models.errores import RecursoNoEncontradoError
from schemas.medicionpunto import MedicionPunto
from schemas.monitoreo import MedicionOut, MonitoreoListado, MonitoreoOut
from utils.validaciones import _validar_rango_fechas

router = APIRouter(
    prefix="/api/monitoreos",
    tags=["Monitoreos"]
)


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
# Listado general (paginado: con 10 lecturas no se puede traer todo)
# ---------------------------------------------------------------------------
@router.get("/", response_model=list[MonitoreoListado])
def listar_monitoreos(
    id_dispositivo: str | None = None,
    limite: int = Query(100, ge=1, le=1000),
    saltar: int = Query(0, ge=0),
):
    filtro = {"meta.dispositivo_id": id_dispositivo} if id_dispositivo else {}

    docs = monitoreos_collection.find(
        filtro,
        {"fecha_monitoreo": 1, "fecha_carga": 1, "meta": 1},
    ).sort("fecha_monitoreo", -1).skip(saltar).limit(limite)

    return [
        MonitoreoListado(
            fecha_monitoreo=d["fecha_monitoreo"],
            fecha_carga=d["fecha_carga"],
            dispositivo_id=d["meta"]["dispositivo_id"],
            polipasto_id=str(d["meta"]["polipasto_id"]),
        )
        for d in docs
    ]


# ---------------------------------------------------------------------------
# Conteo (no carga los documentos en memoria)
# ---------------------------------------------------------------------------
@router.get("/count")
def obtener_count_monitoreos(id_dispositivo: str | None = None):
    filtro = {"meta.dispositivo_id": id_dispositivo} if id_dispositivo else {}
    return {"total_monitoreos": monitoreos_collection.count_documents(filtro)}


# ---------------------------------------------------------------------------
# Histórico de una entrada
# ---------------------------------------------------------------------------
@router.get("/historico/{id_dispositivo}/{entrada}", response_model=list[MedicionPunto])
def obtener_historial_entrada(
    id_dispositivo: str,
    entrada: EntradaSensor,
    desde: datetime | None = None,
    hasta: datetime | None = None,
    limite: int = Query(5000, ge=1, le=100000),
):
    if desde and hasta:
        _validar_rango_fechas(desde, hasta)

    # La entrada ("AI0", etc.) vive en el catálogo del dispositivo;
    # en los monitoreos solo se guarda el id del canal.
    catalogo = _obtener_catalogo(id_dispositivo)
    canal_id = next(
        (cid for cid, c in catalogo.items() if c["entrada"] == entrada.value),
        None,
    )
    if canal_id is None:
        raise RecursoNoEncontradoError(
            f"El dispositivo '{id_dispositivo}' no tiene la entrada '{entrada.value}'"
        )

    mediciones = list(
        monitoreos_collection.aggregate([
            {"$match": {
                "meta.dispositivo_id": id_dispositivo,
                **_filtro_fechas(desde, hasta),
            }},
            # Se toman las N lecturas más recientes (cada documento trae
            # exactamente una medición de ese canal, así que N docs = N puntos)
            {"$sort": {"fecha_monitoreo": -1}},
            {"$limit": limite},
            {"$unwind": "$mediciones"},
            {"$match": {"mediciones.canal": canal_id}},
            {"$project": {
                "_id": 0,
                "fecha": "$fecha_monitoreo",
                "valor": "$mediciones.valor",
            }},
            {"$sort": {"fecha": 1}},
        ])
    )

    if not mediciones:
        raise RecursoNoEncontradoError(
            f"No hay mediciones de '{entrada.value}' para el dispositivo '{id_dispositivo}'"
        )

    return mediciones


# ---------------------------------------------------------------------------
# Monitoreos de un dispositivo en un rango de fechas
# ---------------------------------------------------------------------------
@router.get("/{id_dispositivo}/{f_inicio}/{f_fin}", response_model=list[MonitoreoOut])
def obtener_monitoreos_por_rango(
    id_dispositivo: str,
    f_inicio: datetime,
    f_fin: datetime,
    limite: int = Query(5000, ge=1, le=50000),
):
    _validar_rango_fechas(f_inicio, f_fin)

    catalogo = _obtener_catalogo(id_dispositivo)

    docs = list(
        monitoreos_collection.find({
            "meta.dispositivo_id": id_dispositivo,
            "fecha_monitoreo": {"$gte": f_inicio, "$lte": f_fin},
        })
        .sort("fecha_monitoreo", 1)
        .limit(limite)
    )

    if not docs:
        raise RecursoNoEncontradoError(
            f"No hay mediciones para el dispositivo '{id_dispositivo}'"
        )

    return [
        MonitoreoOut(
            fecha_monitoreo=d["fecha_monitoreo"],
            dispositivo_id=d["meta"]["dispositivo_id"],
            polipasto_id=str(d["meta"]["polipasto_id"]),
            mediciones=[
                MedicionOut(
                    canal=m["canal"],
                    valor=m["valor"],
                    **catalogo.get(m["canal"], {}),
                )
                for m in d["mediciones"]
            ],
        )
        for d in docs
    ]