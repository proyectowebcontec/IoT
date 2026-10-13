from pydantic import BaseModel, Field
from datetime import datetime
from schemas.tipos import PyObjectId
from enum import StrEnum

class EstadoDispositivo(StrEnum):
    ONLINE = "online"
    OFFLINE = "offline"
    MANTENIMIENTO = "mantenimiento"

class Canal(BaseModel):
    id: int
    descripcion: str
    entrada: str
    unidad: str | None = None

class DispositivoBase(BaseModel):
    nombre: str
    estado: EstadoDispositivo

class DispositivoCreate(DispositivoBase):
    empresa_id: PyObjectId
    canales: list[Canal] | None = None
    ultima_conexion: datetime
    firmware: str | None = None
    

class DispositivoResumen(DispositivoBase):
    id: str = Field(alias="_id")
    ultima_conexion: datetime
    
class Dispositivo(BaseModel):
    IDDispositivo: str