from typing import Annotated

from bson import ObjectId
from pydantic import BeforeValidator, InstanceOf, PlainSerializer, WithJsonSchema


def _a_objectid(v):
    if isinstance(v, ObjectId):
        return v
    if isinstance(v, str) and ObjectId.is_valid(v):
        return ObjectId(v)
    raise ValueError("ObjectId inválido")


PyObjectId = Annotated[
    InstanceOf[ObjectId],
    BeforeValidator(_a_objectid),
    PlainSerializer(str, return_type=str, when_used="json"),
    WithJsonSchema({"type": "string", "examples": ["6acd101e92ef3900c59403e2"]}),
]