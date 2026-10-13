from pydantic import BaseModel, Field
from schemas.tipos import PyObjectId

class Ubicacion(BaseModel):
    empresa_id: PyObjectId
    sucursal_id: PyObjectId
    area_id: PyObjectId
    nave_id: PyObjectId

class PolipastoBase(BaseModel):
    no_serie: str
    no_fabrica: str
    marca: str
    factor_trabajo: float
    capacidad_nominal: float
    capacidad_carga: float

class PolipastoCreate(PolipastoBase):
    alias: str
    ubicacion: Ubicacion
    activo: bool
    dispositivo_id: str | None = None

class PolipastoResumen(BaseModel):
    id: PyObjectId = Field(alias="_id")
    no_serie: str
    no_fabrica: str
    alias: str
    Ubicacion: Ubicacion
