from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict, Field
from schemas.tipos import PyObjectId


# ---------- Piezas reutilizables ----------
class MedicionOficial(BaseModel):
    canal: int                      # = dispositivos.canales[].id (antes IdMedicion)
    valor: float


class MonitoreoMeta(BaseModel):     # metaField de la serie de tiempo
    dispositivo_id: str
    polipasto_id: PyObjectId


# ---------- Entrada: lo que envía el dispositivo ----------
class MonitoreoCreate(BaseModel):
    dispositivo_id: str
    fecha_monitoreo: datetime       # cuándo midió el equipo
    mediciones: list[MedicionOficial] = Field(min_length=1)


class MonitoreoLote(BaseModel):     # para insertMany (recomendado)
    monitoreos: list[MonitoreoCreate] = Field(min_length=1, max_length=1000)


# ---------- Cómo se guarda en Mongo ----------
class MonitoreoDB(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: PyObjectId | None = Field(default=None, alias="_id")
    fecha_monitoreo: datetime
    fecha_carga: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    meta: MonitoreoMeta
    mediciones: list[Medicion]


# ---------- Salida: lo que devuelve la API ----------
class MedicionOut(MedicionOficial):        # enriquecida con el catálogo del dispositivo
    descripcion: str | None = None
    entrada: str | None = None
    unidad: str | None = None


class MonitoreoOut(BaseModel):
    fecha_monitoreo: datetime
    dispositivo_id: str
    polipasto_id: str
    mediciones: list[MedicionOut]

class MonitoreoOutReporte(BaseModel):
    id: str
    fecha_monitoreo: datetime
    fecha_carga: datetime
    dispositivo_id: str
    polipasto_id: str
    mediciones: list[MedicionOut]


class MonitoreoResumen(BaseModel):  # ejemplo de respuesta corta
    fecha_monitoreo: datetime
    mediciones: list[Medicion]


class Medicion(BaseModel):
    IdMedicion: int
    descripcion: str
    entrada: str
    valor: float | int


class Monitoreo(BaseModel):
    IDMonitoreo: str
    IDDispositivo: str

    FechaMonitoreo: datetime

    FechaCargaDB: datetime

    Mediciones: list[Medicion]

class MonitoreoListado(BaseModel):
    fecha_monitoreo: datetime
    fecha_carga: datetime
    dispositivo_id: str
    polipasto_id: str