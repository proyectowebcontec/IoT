from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Query

from database.mongodb import monitoreos_collection
from models.entradasensor import EntradaSensor
from models.errores import RecursoNoEncontradoError
from schemas.medicionpunto import MedicionPunto
from schemas.responses import PromedioResponse, PulsosResponse, PromediosResponse, PromedioCanalOut
from utils.validaciones import _validar_rango_fechas
from utils.filtrado_enlace import _resolver_canal_id, _puntos_canal, _agregar_canal, _obtener_catalogo

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


# ---------------------------------------------------------------------------
# Mediciones
# ---------------------------------------------------------------------------
@router.get("/mediciones/{id_dispositivo}/{entrada}", response_model=list[MedicionPunto])
def obtener_historial_entrada(id_dispositivo: str, entrada: EntradaSensor):

    canal_id = _resolver_canal_id(id_dispositivo, entrada)
    mediciones = _puntos_canal(id_dispositivo, canal_id, ultimos=500)

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
@router.get("/promedios/{id_dispositivo}", response_model=PromediosResponse)
def obtener_promedios_dispositivo(
    id_dispositivo: str,
    limite: int = Query(500, ge=1, le=50000),
    horas: int | None = Query(None, ge=1, le=168),
):
    catalogo = _obtener_catalogo(id_dispositivo)
    filtro = {"meta.dispositivo_id": id_dispositivo}

    if horas is not None:
        # Modo ventana de tiempo
        desde = datetime.now(timezone.utc) - timedelta(hours=horas)
        filtro["fecha_monitoreo"] = {"$gte": desde}
        etapas_ventana = []
        ventana = f"ultimas_{horas}_horas"
    else:
        # Modo últimos N registros
        etapas_ventana = [
            {"$sort": {"fecha_monitoreo": -1}},
            {"$limit": limite},
        ]
        ventana = f"ultimos_{limite}_registros"

    pipeline = [
        {"$match": filtro},
        *etapas_ventana,
        {"$facet": {
            "total": [{"$count": "n"}],
            "por_canal": [
                {"$unwind": "$mediciones"},
                {"$group": {
                    "_id": "$mediciones.canal",
                    "promedio": {"$avg": "$mediciones.valor"},
                    "muestras": {"$sum": 1},
                }},
                {"$sort": {"_id": 1}},
            ],
        }},
    ]

    resultado = next(monitoreos_collection.aggregate(pipeline), None)
    por_canal = resultado["por_canal"] if resultado else []
    total = resultado["total"][0]["n"] if resultado and resultado["total"] else 0

    if not por_canal:
        raise RecursoNoEncontradoError(
            f"No hay mediciones para el dispositivo '{id_dispositivo}'"
        )

    return PromediosResponse(
        IDDispositivo=id_dispositivo,
        ventana=ventana,
        registros=total,
        promedios=[
            PromedioCanalOut(
                canal=c["_id"],
                promedio=c["promedio"],
                muestras=c["muestras"],
                **catalogo.get(c["_id"], {}),
            )
            for c in por_canal
        ],
    )

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


@router.get("/promedio/{id_dispositivo}/{f_inicio}/{f_fin}", response_model=list[PromedioResponse])
def obtener_promedio_entrada_fecha(
    id_dispositivo: str, f_inicio: datetime, f_fin: datetime
):

    _validar_rango_fechas(f_inicio, f_fin)

    catalogo = _obtener_catalogo(id_dispositivo)
    # print(catalogo[1]["entrada"])
    promedios = []

    # Las variables a las que se les está calculando el promedio corresponden a U1, U2 y U3, sus ID son 1-3
    # Ajustar según necesidad
    for i in range(1, 4):
        promedio = _agregar_canal(id_dispositivo, i, "$avg", f_inicio, f_fin)
        promedio_format = PromedioResponse(
                            IDDispositivo=id_dispositivo,
                            entrada=catalogo[i]["entrada"],
                            promedio=promedio
                          )
        promedios.append(promedio_format)


    if promedio is None:
        raise RecursoNoEncontradoError(
            f"No hay mediciones para el dispositivo '{id_dispositivo}' "
            f"entre '{f_inicio}' y '{f_fin}'"
        )

    return promedios


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