function EstadoBadge({ conectado }) {
  return (
    <span className={`device-status ${conectado ? "device-status--online" : "device-status--offline"}`}>
      <span className="device-status-dot" />
      {conectado ? "Conectado" : "Desconectado"}
    </span>
  );
}

// dispositivos: [{ id, nombre, conectado, ultimoMantenimiento, ultimaConexion }]
export default function DispositivosTable({ dispositivos }) {
  return (
    <section className="section-block">
      <div className="section-header">
        <div>
          <h2>Listado de dispositivos</h2>
          <p>{dispositivos.length} resultado{dispositivos.length === 1 ? "" : "s"}</p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">Dispositivo</th>
              <th scope="col">Estado</th>
              <th scope="col">Último mantenimiento</th>
              <th scope="col">Última conexión</th>
            </tr>
          </thead>

          <tbody>
            {dispositivos.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted py-4">
                  No se encontraron dispositivos con los filtros aplicados.
                </td>
              </tr>
            ) : (
              dispositivos.map((d) => (
                <tr key={d.id}>
                  <td>{d.nombre}</td>
                  <td><EstadoBadge conectado={d.conectado} /></td>
                  <td>{d.ultimoMantenimiento ?? "—"}</td>
                  <td>{d.ultimaConexion ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
