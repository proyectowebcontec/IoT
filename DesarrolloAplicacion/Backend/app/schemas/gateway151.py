from pydantic import BaseModel


class SensorData(BaseModel):
    flag: str
    value: float | int | None = None
    switcher: int | None = None


class GatewayData(BaseModel):
    times: str
    sensorDatas: list[SensorData]