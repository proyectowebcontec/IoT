from fastapi import APIRouter, Query
from models.errores import RecursoNoEncontradoError
from schemas.empresa import EmpresaOpcion, SucursalOpcion, NaveOpcion, AreaOpcion
from database.mongodb import empresas_collection


router = APIRouter(
    prefix="/api/empresas",
    tags=["Empresas"]
)


@router.get("/arbol", response_model=list[EmpresaOpcion])
def arbol_empresas(solo_activas: bool = Query(True)):
    filtro = {"activa": True} if solo_activas else {}
    proyeccion = {
        "nombre": 1,
        "sucursales._id": 1,
        "sucursales.nombre": 1,
        "sucursales.areas._id": 1,
        "sucursales.areas.nombre": 1,
        "sucursales.areas.naves._id": 1,
        "sucursales.areas.naves.nombre": 1,
    }

    docs = empresas_collection.find(filtro, proyeccion).sort("nombre", 1)

    return [
        EmpresaOpcion(
            id=str(e["_id"]),
            nombre=e["nombre"],
            sucursales=[
                SucursalOpcion(
                    id=str(s["_id"]),
                    nombre=s["nombre"],
                    areas=[
                        AreaOpcion(
                            id=str(a["_id"]),
                            nombre=a["nombre"],
                            naves=[
                                NaveOpcion(id=str(n["_id"]), nombre=n["nombre"])
                                for n in a.get("naves") or []
                            ],
                        )
                        for a in s.get("areas") or []
                    ],
                )
                for s in e.get("sucursales") or []
            ],
        )
        for e in docs
    ]