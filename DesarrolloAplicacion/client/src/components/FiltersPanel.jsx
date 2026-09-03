export default function FiltersPanel({
  dispositivos, // [{ id, nombre }]
  filtros, // { dispositivoId, periodo, fechaInicio, fechaFin }
  onChange, // (field, value) => void
  onAplicar, // () => void
  onLimpiar, // () => void
}) {
  return (
    <section className="filters-panel">
      <div className="filters-title">
        <div>
          <h2>Filtros</h2>
          <p>Seleccione el dispositivo y período que desea consultar.</p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={onLimpiar}
        >
          Limpiar filtros
        </button>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="select-dispositivos">Dispositivo</label>
          <select
            className="form-select"
            id="select-dispositivos"
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
          <label htmlFor="select-periodo">Período rápido</label>
          <select
            className="form-select"
            id="select-periodo"
            value={filtros.periodo}
            onChange={(e) => onChange("periodo", e.target.value)}
          >
            <option value="">Seleccione un período</option>
            <option value="1h">Última hora</option>
            <option value="6h">Últimas 6 horas</option>
            <option value="12h">Últimas 12 horas</option>
            <option value="24h">Últimas 24 horas</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="today">Hoy</option>
            <option value="tr">Tiempo real</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="fecha-inicio">Desde</label>
          <input
            type="datetime-local"
            className="form-control"
            id="fecha-inicio"
            value={filtros.fechaInicio}
            onChange={(e) => onChange("fechaInicio", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="fecha-fin">Hasta</label>
          <input
            type="datetime-local"
            className="form-control"
            id="fecha-fin"
            value={filtros.fechaFin}
            onChange={(e) => onChange("fechaFin", e.target.value)}
          />
        </div>

        <div className="filter-group filter-button">
          <button type="button" className="btn-filter" onClick={onAplicar}>
            Aplicar filtros
          </button>
        </div>
      </div>
    </section>
  );
}
