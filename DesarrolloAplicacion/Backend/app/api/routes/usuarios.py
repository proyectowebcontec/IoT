from fastapi import APIRouter
from models.errores import RecursoNoEncontradoError
from schemas.usuario import UsuarioOut, UsuarioCreate, UsuarioResumen, UsuarioDB
from database.mongodb import usuarios_collection
from utils.encriptacion import Crypt
from datetime import datetime

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

@router.post("/login", response_model=UsuarioResumen)
def login(email: str, password: str):
    # extraer usuario de la BD
    user = usuarios_collection.find_one({ "email": email })

    if not user or not user['activo']:
        return {
            "_id": "6acd101e92ef3900c59403e2",
            "nombre": "",
            "rol": ""
        }
    
    # comparar las contraseñas desencriptando la registrada
    isPasswordValid = funcs.decrypt(user['password_hash']) == password
    
    # Si es incorrecta negar el ingreso y mensaje de error
    if not isPasswordValid:
        return {
            "_id": "6acd101e92ef3900c59403e2",
            "nombre": "",
            "rol": ""
        }

    # Si es correcta permitir el ingreso 
    #   - actualizar último ingreso y retornar el usuario
    usuarios_collection.update_one({ "email": email }, {"$set": {"ultimo_login": datetime.now()}})

    return user


