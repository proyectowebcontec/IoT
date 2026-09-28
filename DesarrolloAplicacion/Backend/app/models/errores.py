
"""
Errores de dominio estandarizados para la API.

Toda excepción de negocio (no encontrado, rango inválido, etc.) hereda de
ErrorDominio. Al registrar UN solo handler para ErrorDominio en main.py,
FastAPI/Starlette lo aplica también a todas sus subclases, así que
cualquier router (dashboard, dispositivos, etc.) puede lanzar sus propias
excepciones y siempre saldrán con el mismo formato de respuesta.
"""

from fastapi import Request
from fastapi. responses import JSONResponse

class ErrorDominio(Exception):
    """Clase base para errores de negocio de la aplicación."""

    codigo: str = "ERROR_DESCONOCIDO"
    status_code: int = 400

    def __init__(self, mensaje: str):
        self.mensaje = mensaje
        super().__init__(mensaje)


class RecursoNoEncontradoError(ErrorDominio):
    """No existen datos que cumplan con los criterios solicitados."""

    codigo = "RECURSO_NO_ENCONTRADO"
    status_code = 404


class RangoFechasInvalidoError(ErrorDominio):
    """El rango de fechas solicitado no es válido (ej. f_inicio > f_fin)."""

    codigo = "RANGO_FECHAS_INVALIDO"
    status_code = 422


async def manejar_error_dominio(request: Request, exc: ErrorDominio) -> JSONResponse:
    """
    Handler global: convierte cualquier ErrorDominio (o subclase) en una
    respuesta JSON con formato uniforme.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "codigo": exc.codigo,
                "mensaje": exc.mensaje
            }
        }
    )