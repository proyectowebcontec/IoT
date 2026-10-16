from datetime import datetime
from pydantic import BaseModel
from schemas.tipos import PyObjectId

class AlarmaLogBase(BaseModel):
    empresa_id: PyObjectId
    polipasto_id: PyObjectId
    fecha: datetime
    regla_id: PyObjectId
    atendida: bool

class AlarmaLogCreate(AlarmaLogBase):
    dispositivo_id: str | None = None
    fecha_monitoreo: datetime | None = None
    polipasto_alias: str
    regla_nombre: str
    valor_medido: str | None = None
    atendida_por: str
    atendida_en: datetime
