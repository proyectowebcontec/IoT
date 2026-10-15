from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Query, HTTPException

from database.mongodb import monitoreos_collection, polipastos_collection, dispositivos_collection
from models.entradasensor import EntradaSensor
from models.errores import RecursoNoEncontradoError
from schemas.medicionpunto import MedicionPunto
from schemas.monitoreo import MedicionOut, MonitoreoListado, MonitoreoOut
from schemas.dispositivos import EstadoDispositivo
from utils.validaciones import _validar_rango_fechas
from utils.filtrado_enlace import _filtro_fechas, _obtener_catalogo

router = APIRouter(
    prefix="/api/monitoreos",
    tags=["Monitoreos"]
)

# ---------------------------------------------------------------------------
# Utilidades
# ---------------------------------------------------------------------------
def _a_objectid(valor: str, nombre: str) -> ObjectId:
    if not ObjectId.is_valid(valor):
        raise HTTPException(status_code=422, detail=f"'{nombre}' no es un id válido")
    return ObjectId(valor)


def _filtro_dispositivos_en_ubicacion(
    empresa_id: str,
    sucursal_id: str | None,
    area_id: str | None,
    nave_id: str | None,
    estado: EstadoDispositivo | None,
) -> dict:
    """
    Arma el filtro sobre `dispositivos` para una ubicación:
    1. Busca en `polipastos` los que están en esa ubicación y tienen
       un dispositivo asignado.
    2. Devuelve el filtro por esos ids de dispositivo (_id string).
    La empresa es obligatoria; sucursal, área y nave acotan cada vez más.
    """
    filtro_polipastos = {
        "ubicacion.empresa_id": _a_objectid(empresa_id, "empresa_id"),
        "dispositivo_id": {"$type": "string"},     # ignora polipastos sin dispositivo
    }
    if sucursal_id:
        filtro_polipastos["ubicacion.sucursal_id"] = _a_objectid(sucursal_id, "sucursal_id")
    if area_id:
        filtro_polipastos["ubicacion.area_id"] = _a_objectid(area_id, "area_id")
    if nave_id:
        filtro_polipastos["ubicacion.nave_id"] = _a_objectid(nave_id, "nave_id")

    ids_dispositivos = [
        p["dispositivo_id"]
        for p in polipastos_collection.find(filtro_polipastos, {"dispositivo_id": 1})
    ]

    preFiltro = {"_id": {"$in": ids_dispositivos}}

    if estado:
        preFiltro["estado"] = estado.value

    ids_dispositivos2 = [
            p["_id"]
            for p in dispositivos_collection.find(preFiltro, {"_id": 1})
        ]

    filtro = {"meta.dispositivo_id": {"$in": ids_dispositivos2}}

    return filtro

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
def obtener_count_monitoreos(
    empresa_id: str,
    sucursal_id: str | None = None,
    area_id: str | None = None,
    nave_id: str | None = None,
    id_dispositivo: str | None = None,
    estado: EstadoDispositivo | None = None):

    if id_dispositivo:
        filtro = {"meta.dispositivo_id": id_dispositivo}
    else:
        filtro = _filtro_dispositivos_en_ubicacion(
            empresa_id, sucursal_id, area_id, nave_id, estado
        )

    print("FILTRO #########", filtro)
    
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

@router.get("/{id_dispositivo}", response_model=list[MonitoreoOut])
def obtener_ultimos_monitoreos(
    id_dispositivo: str,
    desde: datetime = Query(None),
    limite: int = Query(500, ge=1, le=50000),
):
    catalogo = _obtener_catalogo(id_dispositivo)

    docs = list(
        monitoreos_collection.find({"meta.dispositivo_id": id_dispositivo, **_filtro_fechas(desde, None)})
        .sort("fecha_monitoreo", -1)
        .limit(limite)
    )

    if not docs:
        raise RecursoNoEncontradoError(
            f"No hay mediciones para el dispositivo '{id_dispositivo}'"
        )

    docs.reverse()  # de más antiguo a más reciente

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