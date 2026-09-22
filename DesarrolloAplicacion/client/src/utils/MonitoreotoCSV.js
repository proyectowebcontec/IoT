export function monitoreotoCSV(monitoreos, opciones = {}) {
  const separador = opciones.separador || ',';

  if (!Array.isArray(monitoreos) || monitoreos.length === 0) {
    return '';
  }

  const columnasFijas = ['IDMonitoreo', 'IDDispositivo', 'FechaMonitoreo', 'FechaCargaDB'];

  const entradasSet = new Set();
  for (const m of monitoreos) {
    for (const med of m.Mediciones || []) {
      entradasSet.add(med.entrada);
    }
  }
  const columnasMediciones = Array.from(entradasSet);

  const headers = [...columnasFijas, ...columnasMediciones];

  const escaparValor = (valor) => {
    if (valor === null || valor === undefined) return '';
    let str = valor instanceof Date ? valor.toISOString() : String(valor);
    if (str.includes(separador) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const filas = monitoreos.map((m) => {
    const valoresPorEntrada = {};
    for (const med of m.Mediciones || []) {
      valoresPorEntrada[med.entrada] = med.valor;
    }

    const fila = [
      m.IDMonitoreo,
      m.IDDispositivo,
      m.FechaMonitoreo,
      m.FechaCargaDB,
      ...columnasMediciones.map((entrada) => valoresPorEntrada[entrada]),
    ];

    return fila.map(escaparValor).join(separador);
  });

  return [headers.join(separador), ...filas].join('\r\n');
}