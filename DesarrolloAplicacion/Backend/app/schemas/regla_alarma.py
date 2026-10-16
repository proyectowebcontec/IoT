from pydantic import BaseModel, Field
from schemas.tipos import PyObjectId

class Polipasto(BaseModel):
    id: PyObjectId

class ReglaAlarmaBase(BaseModel):
    nombre: str
    empresa_id: PyObjectId

class ReglaAlarmaCreate(ReglaAlarmaBase):
    activa: bool
    polipastos_id: list[Polipasto] | None = None

class ReglaAlarmaResumen(BaseModel):
    id: PyObjectId = Field(alias="_id")
    nombre: str
    activa: bool