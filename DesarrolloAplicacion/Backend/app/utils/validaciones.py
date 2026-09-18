from datetime import datetime
from models.errores import RangoFechasInvalidoError

def _validar_rango_fechas(f_inicio: datetime, f_fin: datetime) -> None:
    if f_inicio > f_fin:
        raise RangoFechasInvalidoError(
            f"La fecha de inicio ({f_inicio}) no puede ser posterior "
            f"a la fecha de fin ({f_fin})"
        )