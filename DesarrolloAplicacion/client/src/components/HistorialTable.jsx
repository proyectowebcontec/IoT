// registros: [{ObjectId, IDMonitoreo, IDDispositivo, FechaMonitoreo, FechaCargaDB, Mediciones: [IdMedicion, descripcion, entrada, valor]}
export default function HistorialTable({ registros }) {
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
              <th scope="col">Variable 1</th>
              <th scope="col">Variable 2</th>
              <th scope="col">Variable 3</th>
              <th scope="col">Variable 4</th>
              <th scope="col">Pulsaciones</th>
            </tr>
          </thead>

          <tbody>
            {registros.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  No hay registros para mostrar. Ajuste los filtros y aplique la búsqueda.
                </td>
              </tr>
            ) : (
              registros.map((r) => (
                <tr key={r.IDMonitoreo}>
                  <td>{r.FechaMonitoreo}</td>
                  <td>{r.IDDispositivo}</td>
                  <td>{r.Mediciones[0].valor ?? "----"}</td>
                  <td>{r.Mediciones[1].valor ?? "----"}</td>
                  <td>{r.Mediciones[2].valor ?? "----"}</td>
                  <td>{r.Mediciones[3].valor ?? "----"}</td>
                  <td>{r.Mediciones[24].valor ?? "----"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
