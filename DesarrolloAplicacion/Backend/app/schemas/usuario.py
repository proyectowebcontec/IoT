from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from schemas.tipos import PyObjectId

class Sucursal(BaseModel):
    _id: str


class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr
    rol: str


class UsuarioCreate(UsuarioBase):      # lo que recibes al crear
    password: str
    sucursales_permitidas: list[Sucursal] | None = None


class UsuarioDB(UsuarioBase):          # cómo está en Mongo
    id: PyObjectId = Field(alias="_id")
    password_hash: str
    empresa_id: PyObjectId
    sucursales_permitidas: list[Sucursal] | None = None
    activo: bool
    ultimo_login: datetime | None = None


class UsuarioOut(UsuarioBase):         # respuesta completa (sin password_hash)
    id: PyObjectId = Field(alias="_id")
    empresa_id: PyObjectId
    activo: bool
    ultimo_login: datetime | None = None


class UsuarioResumen(BaseModel):       # respuesta corta para listados
    id: PyObjectId = Field(alias="_id")
    nombre: str
    rol: str

class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str