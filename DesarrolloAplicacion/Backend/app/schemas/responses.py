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

class PromedioCanalOut(BaseModel):
    canal: int
    entrada: str | None = None
    descripcion: str | None = None
    unidad: str | None = None
    promedio: float | None
    muestras: int


class PromediosResponse(BaseModel):
    IDDispositivo: str
    ventana: str          # "ultimos_500_registros" o "ultimas_24_horas"
    registros: int
    promedios: list[PromedioCanalOut]