from fastapi import APIRouter

router = APIRouter(
    prefix="/api",
    tags=["Monitoreos"]
)


@router.get("/health")
def get_health():
    return {"status": 1}