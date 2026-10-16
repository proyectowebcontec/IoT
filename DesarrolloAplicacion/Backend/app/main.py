from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends
from models.errores import ErrorDominio, manejar_error_dominio
from utils.seguridad import crear_indices_seguridad, obtener_usuario_actual, requiere_rol
from api.routes.monitoreos import router as monitoreos_router
from api.routes.dispositivos import router as dispositivos_router
from api.routes.dashboard import router as dashboard_router
from api.routes.validaciones import router as validaciones_router
from api.routes.alarmas import router as alarmas_router
from api.routes.usuarios import router as usuarios_router
from api.routes.empresas import router as empresas_router
from api.routes.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    crear_indices_seguridad()
    yield

app = FastAPI(
    title="IoT Monitoring API",
    description="API para monitoreo de dispositivos IoT",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
            "message": "IoT Monitoring API funcionando"
        }


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

# --------------------------------------------------
# Manejo de errores
# --------------------------------------------------
app.add_exception_handler(ErrorDominio, manejar_error_dominio)

app.include_router(auth_router)
proteger = [Depends(obtener_usuario_actual)]
app.include_router(monitoreos_router, dependencies=proteger)
app.include_router(dispositivos_router, dependencies=proteger)
app.include_router(dashboard_router, dependencies=proteger)
app.include_router(validaciones_router, dependencies=proteger)
app.include_router(alarmas_router, dependencies=proteger)
app.include_router(usuarios_router, dependencies=[Depends(requiere_rol("admin"))])
app.include_router(empresas_router, dependencies=proteger)