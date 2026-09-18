from pydantic import BaseModel, Field


class BaseResponse(BaseModel):
    id: int
    title: str = Field(min_length=1, max_length=100)
    code: int
    msg: str = Field(min_length=10)

