// Convierte el valor de "Período rápido" (select-periodo) en un rango
// { fechaInicio, fechaFin } listo para los inputs datetime-local.

// Formatea un Date a "YYYY-MM-DDTHH:mm" (formato que espera <input type="datetime-local">)
function toDatetimeLocal(date) {
  const pad = (n) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * @param {string} periodo - uno de: "1h" | "6h" | "12h" | "24h" | "7d" | "30d" | "today" | ""
 * @param {Date} [ahora] - opcional, útil para pruebas; por defecto usa la hora actual
 * @returns {{ fechaInicio: string, fechaFin: string } | null} null si el período no es reconocido o está vacío
 */

export function calcularRangoPorPeriodo(periodo, ahora = new Date()) {
  const fin = new Date(ahora);
  let inicio;

  switch (periodo) {
    case "1h":
      inicio = new Date(ahora.getTime() - 1 * 60 * 60 * 1000);
      break;

    case "6h":
      inicio = new Date(ahora.getTime() - 6 * 60 * 60 * 1000);
      break;

    case "12h":
      inicio = new Date(ahora.getTime() - 12 * 60 * 60 * 1000);
      break;

    case "24h":
      inicio = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);
      break;

    case "7d":
      inicio = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;

    case "30d":
      inicio = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;

    case "today": {
      // Desde las 00:00 de hoy hasta este momento
      inicio = new Date(ahora);
      inicio.setHours(0, 0, 0, 0);
      break;
    }

    default:
      // "" (Seleccione un período) u otro valor no reconocido
      return null;
  }

  return {
    fechaInicio: toDatetimeLocal(inicio),
    fechaFin: toDatetimeLocal(fin),
  };
}