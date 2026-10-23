from pydantic import BaseModel


class SensorData(BaseModel):
    flag: str
    value: float | int | None = None
    switcher: int | None = None
    str: str | None = None


class GatewayData(BaseModel):
    times: str | None = None
    sensorDatas: list[SensorData]

"""ANTES
{"sensorDatas":[{"flag":"U3","value":2.5203750133514404}, 
{"flag":"U2","value":2.467968702316284}, {"flag":"U1","value":1.589772343635559}, 
{"flag":"DI3","switcher":0}]}"""

"""AHORA
{"sensorDatas":[{"flag":"monitoreo",
"str":"2026-10-09 06:51:42.590|1.747861623764038|1.1276919841766357|1.1743526458740234"}]}"""