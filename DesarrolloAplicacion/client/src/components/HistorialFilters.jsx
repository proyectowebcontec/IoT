export default function HistorialFilters({
  dispositivos, // { IDDispositivo }
  filtros, // { dispositivoId, fechaInicio, fechaFin }
  onChange, // (field, value) => void
  onDescargarCSV, // () => void
  descargando = false, // opcional: muestra estado de carga en el botón
}) {
  return (
    <section className="filters-panel">
      <div className="filters-title">
        <div>
          <h2>Historial</h2>
          <p>Seleccione el dispositivo y el rango de fechas a consultar.</p>
        </div>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="select-dispositivo-historial">Dispositivo</label>
          <select
            className="form-select"
            id="select-dispositivo-historial"
            value={filtros.dispositivoId}
            onChange={(e) => onChange("dispositivoId", e.target.value)}
          >
            <option value="">Todos los dispositivos</option>
            {dispositivos.map((d) => (
              <option key={d.IDDispositivo} value={d.IDDispositivo}>
                {d.IDDispositivo}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="fecha-inicio-historial">Desde</label>
          <input
            type="datetime-local"
            className="form-control"
            id="fecha-inicio-historial"
            value={filtros.fechaInicio}
            onChange={(e) => onChange("fechaInicio", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="fecha-fin-historial">Hasta</label>
          <input
            type="datetime-local"
            className="form-control"
            id="fecha-fin-historial"
            value={filtros.fechaFin}
            onChange={(e) => onChange("fechaFin", e.target.value)}
          />
        </div>

        <div className="filter-group filter-button">
          <button
            type="button"
            className="btn-filter"
            onClick={onDescargarCSV}
            disabled={descargando}
          >
            {descargando ? "Generando CSV..." : "Descargar CSV"}
          </button>
        </div>
      </div>
    </section>
  );
}
