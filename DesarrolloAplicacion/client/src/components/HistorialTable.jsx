import { useState } from "react";

// registros: [{ObjectId, IDMonitoreo, IDDispositivo, FechaMonitoreo, FechaCargaDB, Mediciones: [IdMedicion, descripcion, entrada, valor]}
export default function HistorialTable({ registros }) {
  const [page, setPage] = useState(0);
  const COLUMNAS = [
    { entrada: 'U1', decimales: 4 },
    { entrada: 'U2', decimales: 4 },
    { entrada: 'U3', decimales: 4 },
    { entrada: 'DI3', decimales: 0 },
  ];

  const fmtFecha = new Intl.DateTimeFormat('es-GT', { dateStyle: 'short', timeStyle: 'medium' });

  const formatear = (valor, decimales) =>
    typeof valor === 'number' ? valor.toFixed(decimales) : '----';

  const itemPage = 15;

  const Next = () => {
		setPage((prevPage) => Math.min(prevPage + 1, Math.floor(registros.length / itemPage)));
	}

	const Prev = () => {
		setPage((prevPage) => Math.max(prevPage - 1, 0));
	}

	const startIndex = page * itemPage;
	const data = registros.slice(startIndex, startIndex + itemPage);

  return (
    <section className="section-block">
      <div className="section-header">
        <div>
          <h2>Registros</h2>
          <p>Resultados para el dispositivo y rango de fechas seleccionados.</p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">Fecha</th>
              <th scope="col">Dispositivo</th>
              <th scope="col">Corriente en Fase 1</th>
              <th scope="col">Corriente en Fase 2</th>
              <th scope="col">Corriente en Fase 3</th>
              <th scope="col">Pulsaciones</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  No hay registros para mostrar. Ajuste los filtros y aplique la búsqueda.
                </td>
              </tr>
            ) : ( 
              data.map((r) => {
                // Convierte el arreglo en { U5: 19.63, U6: 9.61, ... }
                const valores = Object.fromEntries(
                  (r.Mediciones ?? []).map((m) => [m.entrada, m.valor])
                );
                return (
                  <tr key={r.IDMonitoreo}>
                    <td>{fmtFecha.format(new Date(r.FechaMonitoreo))}</td>
                    <td>{r.IDDispositivo}</td>
                    {COLUMNAS.map((c) => (
                      <td key={c.entrada}>{formatear(valores[c.entrada], c.decimales)}</td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div>
        <button onClick={Prev} disabled={page === 0}>
        Anterior
        </button>
        <button onClick={Next} disabled={startIndex + itemPage >= registros.length}>
        Siguiente
        </button>
      </div>
    </section>
  );
}
