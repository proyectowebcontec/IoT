from datetime import datetime
from models.errores import RangoFechasInvalidoError, NumeroTelefonoError

def _validar_rango_fechas(f_inicio: datetime, f_fin: datetime) -> None:
    if f_inicio > f_fin:
        raise RangoFechasInvalidoError(
            f"La fecha de inicio ({f_inicio}) no puede ser posterior "
            f"a la fecha de fin ({f_fin})"
        )

def _validar_numero_telefono(telefono: str) -> None:
    telefono = telefono.replace(" ", "").replace("-", "")

    # Eliminar código de país de Guatemala
    if telefono.startswith("+502"):
        telefono = telefono[4:]
    elif telefono.startswith("502") and len(telefono) == 11:
        telefono = telefono[3:]

    # Validar que sean exactamente 8 dígitos
    if len(telefono) != 8 and not telefono.isdigit():
        raise NumeroTelefonoError("El número de teléfono ingresado no posee un formato válido.")

        