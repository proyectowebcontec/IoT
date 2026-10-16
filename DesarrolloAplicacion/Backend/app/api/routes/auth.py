from fastapi import APIRouter, HTTPException, status, Request, Depends
from schemas.usuario import  UsuarioLogin, UsuarioResumen
from schemas.responses import LoginResponse
from database.mongodb import usuarios_collection
from utils.encriptacion import Crypt
from datetime import datetime
from utils.seguridad import (
    crear_token,
    limpiar_fallos,
    obtener_usuario_actual,
    registrar_fallo,
    verificar_bloqueo,
)

from config import CADENA_HASH_FALSO

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)

funcs = Crypt()
_HASH_FALSO = funcs.encrypt(CADENA_HASH_FALSO)

def _resumen(usuario: dict) -> dict:
    # Misma forma que ya devolvía tu login
    return {
        "_id": str(usuario["_id"]),
        "nombre": usuario["nombre"],
        "rol": usuario["rol"],
    }

@router.post("/login", response_model=LoginResponse)
def login(data: UsuarioLogin, request: Request):
    email = data.email
    ip = request.client.host if request.client else "desconocida"

    # 429 si esta cuenta/IP ya agotó sus intentos
    verificar_bloqueo(email, ip)

    user = usuarios_collection.find_one({"email": email})

    # Se verifica siempre una contraseña, exista o no el usuario,
    # para que el tiempo de respuesta no revele si el correo está registrado
    pass_usuario = user['password_hash'] if user else _HASH_FALSO
    password_valida = pass_usuario == funcs.encrypt(data.password)

    # Un solo mensaje para todos los fallos (no existe, inactivo, clave mala)
    if not user or not user.get("activo", False) or not password_valida:
        registrar_fallo(email, ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )

    #Login correcto debe reiniciar los fallos
    limpiar_fallos(email, ip)

    usuarios_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"ultimo_login": datetime.now()}},
    )

    return LoginResponse(
        access_token=crear_token(user),
        usuario=_resumen(user),
    )

@router.get("/me", response_model=UsuarioResumen)
def usuario_actual(usuario: dict = Depends(obtener_usuario_actual)):
    """Sirve para restaurar la sesión al recargar la página."""
    return _resumen(usuario)