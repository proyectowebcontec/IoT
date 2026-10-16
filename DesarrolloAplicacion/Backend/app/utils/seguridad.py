"""
Seguridad de la API: tokens JWT, dependencias de autenticación/roles y
límite de intentos fallidos de login.

Requisitos:
    pip install pyjwt argon2-cffi
Variables de entorno:
    JWT_SECRET_KEY   (obligatoria)  python -c "import secrets; print(secrets.token_urlsafe(64))"
    JWT_MINUTOS      (opcional, por defecto 60)
"""
from datetime import datetime, timedelta, timezone

import jwt
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from database.mongodb import intentos_login_collection, usuarios_collection
from config import MINUTOS_TOKEN, MAX_INTENTOS_CUENTA, MAX_INTENTOS_IP, SECRET_KEY, ALGORITHM, VENTANA_SEGUNDOS

bearer = HTTPBearer(auto_error=False)


def _no_autenticado(detalle: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detalle,
        headers={"WWW-Authenticate": "Bearer"},
    )


# ---------------------------------------------------------------------------
# Tokens
# ---------------------------------------------------------------------------
def crear_token(usuario: dict) -> str:
    ahora = datetime.now(timezone.utc)
    payload = {
        "sub": str(usuario["_id"]),
        "rol": usuario["rol"],
        "iat": ahora,
        "exp": ahora + timedelta(minutes=MINUTOS_TOKEN),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# ---------------------------------------------------------------------------
# Dependencias de FastAPI
# ---------------------------------------------------------------------------
def obtener_usuario_actual(
    credenciales: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> dict:
    """Valida el token y devuelve el usuario (sin password_hash)."""
    if credenciales is None:
        raise _no_autenticado("No autenticado")

    try:
        payload = jwt.decode(credenciales.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise _no_autenticado("Sesión expirada")
    except jwt.InvalidTokenError:
        raise _no_autenticado("Token inválido")

    try:
        usuario_id = ObjectId(payload["sub"])
    except (KeyError, InvalidId):
        raise _no_autenticado("Token inválido")

    # Se consulta la BD en cada petición: si el usuario se desactiva o
    # cambia de rol, el efecto es inmediato aunque el token siga vigente.
    usuario = usuarios_collection.find_one({"_id": usuario_id}, {"password_hash": 0})
    if usuario is None or not usuario.get("activo", False):
        raise _no_autenticado("Usuario no autorizado")

    return usuario


def requiere_rol(*roles: str):
    """Uso: Depends(requiere_rol("admin")) o requiere_rol("admin", "operador")."""
    def dependencia(usuario: dict = Depends(obtener_usuario_actual)) -> dict:
        if usuario.get("rol") not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para esta acción",
            )
        return usuario
    return dependencia


# ---------------------------------------------------------------------------
# Límite de intentos fallidos de login
# (en Mongo, para que funcione con varios workers y sobreviva a reinicios)
# ---------------------------------------------------------------------------
def crear_indices_seguridad() -> None:
    """Llamar una vez al arrancar la app (es idempotente)."""
    intentos_login_collection.create_index("fecha", expireAfterSeconds=VENTANA_SEGUNDOS)
    intentos_login_collection.create_index([("clave", 1), ("fecha", 1)])


def _claves(email: str, ip: str) -> tuple[str, str]:
    return f"cuenta:{email}|{ip}", f"ip:{ip}"


def _contar(clave: str, desde: datetime) -> int:
    return intentos_login_collection.count_documents(
        {"clave": clave, "fecha": {"$gte": desde}}
    )


def verificar_bloqueo(email: str, ip: str) -> None:
    """Lanza 429 si ya se superó el máximo de fallos en la ventana."""
    desde = datetime.now(timezone.utc) - timedelta(seconds=VENTANA_SEGUNDOS)
    clave_cuenta, clave_ip = _claves(email, ip)

    if (_contar(clave_cuenta, desde) >= MAX_INTENTOS_CUENTA
            or _contar(clave_ip, desde) >= MAX_INTENTOS_IP):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Demasiados intentos fallidos. Intenta de nuevo en {VENTANA_SEGUNDOS // 60} minutos.",
            headers={"Retry-After": str(VENTANA_SEGUNDOS)},
        )


def registrar_fallo(email: str, ip: str) -> None:
    ahora = datetime.now(timezone.utc)
    clave_cuenta, clave_ip = _claves(email, ip)
    intentos_login_collection.insert_many([
        {"clave": clave_cuenta, "fecha": ahora},
        {"clave": clave_ip, "fecha": ahora},
    ])


def limpiar_fallos(email: str, ip: str) -> None:
    """Tras un login correcto se reinicia el contador de esa cuenta."""
    clave_cuenta, _ = _claves(email, ip)
    intentos_login_collection.delete_many({"clave": clave_cuenta})
