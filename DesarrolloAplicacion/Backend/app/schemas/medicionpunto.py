from datetime import datetime

from pydantic import BaseModel


class MedicionPunto(BaseModel):
    fecha: datetime
    valor: float