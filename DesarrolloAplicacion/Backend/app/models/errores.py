from fastapi import Request
from fastapi. responses import JSONResponse
# --------------------------------------------------------
# Excepción datos no encontrados
# --------------------------------------------------------
class RecursoNoEncontradoError(Exception):
    def __init__(self, mensaje: str):
        self.mensaje = mensaje

async def manejar_recurso_no_encontrado(request: Request, exc: RecursoNoEncontradoError):
    return JSONResponse(
        status_code=404,
        content={
            "error": {
                "codigo": "RECURSO_NO_ENCONTRADO",
                "mensaje": exc.mensaje
            }
        }
    )