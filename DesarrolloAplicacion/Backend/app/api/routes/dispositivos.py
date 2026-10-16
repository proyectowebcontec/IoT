from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query
from models.errores import RecursoNoEncontradoError
from schemas.dispositivos import DispositivoResumen, EstadoDispositivo, DispositivoOut
from database.mongodb import dispositivos_collection, polipastos_collection


router = APIRouter(
    prefix="/api/dispositivos",
    tags=["Dispositivos"]
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

    filtro = {"_id": {"$in": ids_dispositivos}}
    if estado:
        filtro["estado"] = estado.value
    return filtro

# ---------------------------------------------------------------------------
# Conteo por ubicación
# ---------------------------------------------------------------------------
@router.get("/ubicacion/count")
def contar_dispositivos_por_ubicacion(
    empresa_id: str,
    sucursal_id: str | None = None,
    area_id: str | None = None,
    nave_id: str | None = None,
    estado: EstadoDispositivo | None = None,
):    
    filtro = _filtro_dispositivos_en_ubicacion(
        empresa_id, sucursal_id, area_id, nave_id, estado
    )

    return {"total_dispositivos": dispositivos_collection.count_documents(filtro)}


# ---------------------------------------------------------------------------
# Listado
# ---------------------------------------------------------------------------
@router.get("/", response_model=list[DispositivoResumen]) # completo, paginado, con estado
def obtener_dispositivos(
    empresa_id: str,
    sucursal_id: str | None = None,
    area_id: str | None = None,
    nave_id: str | None = None
):

    filtro = _filtro_dispositivos_en_ubicacion(
        empresa_id, sucursal_id, area_id, nave_id, None
    )

    dispositivos = list(
        dispositivos_collection.find(filtro, {"empresa_id": 0, "canales": 0, "firmware": 0})
    )

    if not dispositivos:
        raise RecursoNoEncontradoError(
            f"No hay dispositivos registrados."
        )

    return dispositivos

@router.get("/resumen", response_model=list[DispositivoOut])
def listar_dispositivos_por_ubicacion( # liviano, para selects/combos
    empresa_id: str,
    sucursal_id: str | None = None,
    area_id: str | None = None,
    nave_id: str | None = None,
    estado: EstadoDispositivo | None = None,
    limite: int = Query(100, ge=1, le=1000),
    saltar: int = Query(0, ge=0),
):
    filtro = _filtro_dispositivos_en_ubicacion(
        empresa_id, sucursal_id, area_id, nave_id, estado
    )

    docs = list(
        dispositivos_collection.find(filtro)
        .sort("_id", 1)
        .skip(saltar)
        .limit(limite)
    )

    # En Mongo el identificador es _id; en la API se expone como id
    for d in docs:
        d["id"] = d.pop("_id")
    
    return docs


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

