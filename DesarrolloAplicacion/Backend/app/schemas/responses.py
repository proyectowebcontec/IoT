from pydantic import BaseModel, Field
from models.entradasensor import EntradaSensor

class BaseResponse(BaseModel):
    id: int
    title: str = Field(min_length=1, max_length=100)
    code: int
    msg: str = Field(min_length=10)


class PromedioResponse(BaseModel):
    IDDispositivo: str
    entrada: EntradaSensor
    promedio: float


class PulsosResponse(BaseModel):
    IDDispositivo: str
    entrada: EntradaSensor
    total: float