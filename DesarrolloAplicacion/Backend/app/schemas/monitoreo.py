from datetime import datetime
from pydantic import BaseModel


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