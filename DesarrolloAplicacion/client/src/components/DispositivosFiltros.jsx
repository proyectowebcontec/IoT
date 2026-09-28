export default function DispositivosFiltros({
  filtros, // { busqueda, estado } -- estado: "" | "conectado" | "desconectado"
  onChange, // (field, value) => void
}) {
  return (
    <section className="filters-panel">
      <div className="filters-title">
        <div>
          <h2>Dispositivos</h2>
          <p>Busque por nombre o filtre por estado de conexión.</p>
        </div>
      </div>

      <div className="filters-grid filters-grid--2">
        <div className="filter-group">
          <label htmlFor="busqueda-dispositivos">Buscar por nombre</label>
          <input
            type="text"
            className="form-control"
            id="busqueda-dispositivos"
            placeholder="Ej. Sensor planta 2"
            value={filtros.busqueda}
            onChange={(e) => onChange("busqueda", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="select-estado-dispositivos">Estado</label>
          <select
            className="form-select"
            id="select-estado-dispositivos"
            value={filtros.estado}
            onChange={(e) => onChange("estado", e.target.value)}
          >
            <option value="">Todos</option>
            <option value="conectado">Conectado</option>
            <option value="desconectado">Desconectado</option>
          </select>
        </div>
      </div>
    </section>
  );
}
