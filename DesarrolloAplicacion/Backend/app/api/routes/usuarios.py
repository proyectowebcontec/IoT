from fastapi import APIRouter
from schemas.usuario import UsuarioOut
from database.mongodb import usuarios_collection
from utils.encriptacion import Crypt

funcs = Crypt()

router = APIRouter(
    prefix="/api/usuarios",
    tags=["Usuarios"]
)


@router.get("/", response_model=list[UsuarioOut])
def obtener_usuarios():
    # Extraer usuarios de la BD
    # Retornar los usuarios
    usuarios = list(
        usuarios_collection.find({}, {"password_hash": 0})   # todo menos el hash
    )

    return usuarios

@router.post("/encrypt")
def encriptar(texto: str):

    return funcs.encrypt(texto)

@router.post("/decrypt")
def desencriptar(texto_hash: str):
    
    return funcs.decrypt(texto_hash)
