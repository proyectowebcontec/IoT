from fastapi import FastAPI
from api.routes.monitoreos import router as monitoreos_router
from api.routes.dispositivos import router as dispositivos_router
from api.routes.dashboard import router as dashboard_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="IoT Monitoring API",
    description="API para monitoreo de dispositivos IoT",
    version="1.0.0"
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


app.include_router(monitoreos_router)
app.include_router(dispositivos_router)
app.include_router(dashboard_router)