from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field, field_validator
from schemas.tipos import PyObjectId


class Coordenadas(BaseModel):
    type: Literal["Point"] = "Point"
    coordinates: tuple[float, float]   # [longitud, latitud]

    @field_validator("coordinates")
    @classmethod
    def validar_rango(cls, v):
        lon, lat = v
        if not -180 <= lon <= 180:
            raise ValueError("longitud fuera de rango (-180 a 180)")
        if not -90 <= lat <= 90:
            raise ValueError("latitud fuera de rango (-90 a 90)")
        return v


class Ubicacion(BaseModel):
    direccion: str | None = None
    ciudad: str | None = None
    pais: str | None = None
    coordenadas: Coordenadas | None = None


class Nave(BaseModel):
    id: PyObjectId = Field(alias="_id")
    nombre: str
    descripcion: str | None = None


class Area(BaseModel):
    id: PyObjectId = Field(alias="_id")
    nombre: str
    naves: list[Nave] | None = None


class Sucursal(BaseModel):
    id: PyObjectId = Field(alias="_id")
    nombre: str
    areas: list[Area] | None = None
    ubicacion: Ubicacion | None = None


class EmpresaBase(BaseModel):
    nombre: str


class EmpresaCreate(EmpresaBase):
    activa: bool
    sucursales: list[Sucursal]
    creado_en: datetime
   

class EmpresaResumen(EmpresaBase):
    id: PyObjectId = Field(alias="_id")
    activa: bool

class NaveOpcion(BaseModel):
    id: str
    nombre: str


class AreaOpcion(BaseModel):
    id: str
    nombre: str
    naves: list[NaveOpcion] = []


class SucursalOpcion(BaseModel):
    id: str
    nombre: str
    areas: list[AreaOpcion] = []


class EmpresaOpcion(BaseModel):
    id: str
    nombre: str
    sucursales: list[SucursalOpcion] = []