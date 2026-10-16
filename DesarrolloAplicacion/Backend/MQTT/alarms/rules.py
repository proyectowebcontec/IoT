"""Carga y evaluacion de reglas de alarma almacenadas en MongoDB."""

from collections.abc import Iterable, Mapping
from operator import eq, ge, gt, le, lt, ne
from typing import Any

from ..database.mongodb import reglas_collection

OPERATORS = {
    ">": gt,
    ">=": ge,
    "<": lt,
    "<=": le,
    "==": eq,
    "!=": ne,
}


def get_active_rules(
    device_id: str,
    inputs: Iterable[str] | None = None,
) -> list[dict[str, Any]]:
    query: dict[str, Any] = {
        "dispositivo": device_id,
        "activo": True,
    }
    if inputs is not None:
        input_list = list(inputs)
        if not input_list:
            return []
        query["entrada"] = {"$in": input_list}

    return list(reglas_collection.find(query))


def rule_matches(rule: Mapping[str, Any], value: float | int) -> bool:
    operator_symbol = str(rule.get("operador", ""))
    operation = OPERATORS.get(operator_symbol)
    if operation is None:
        raise ValueError(f"Operador de alarma no soportado: {operator_symbol!r}")

    try:
        threshold = float(rule["umbral"])
        numeric_value = float(value)
    except (KeyError, TypeError, ValueError) as exc:
        raise ValueError("La regla debe contener un umbral numerico valido.") from exc

    return operation(numeric_value, threshold)
