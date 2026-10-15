export default function FiltersPanel({
  empresas,
  dispositivos, // [{"nombre": "string", "id": "string"}]
  filtros, // { empresaId, sucursalId, areaId, naveId, dispositivoId, periodo, fechaInicio, fechaFin }
  onChange, // (field, value) => void
  onAplicar, // () => void
  onLimpiar, // () => void
}) {
    const empresa  = empresas.find(e => e.id === filtros.empresaId);
    const sucursal = empresa?.sucursales.find(s => s.id === filtros.sucursalId);
    const area     = sucursal?.areas.find(a => a.id === filtros.areaId);
  
    const opcionesEmpresas   = empresas;
    const opcionesSucursales = empresa?.sucursales ?? [];
    const opcionesAreas      = sucursal?.areas ?? [];
    const opcionesNaves      = area?.naves ?? [];

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

      <div className="filters-pre-grid">
        <div className="filter-group">
          <label htmlFor="select-empresas">Empresa</label>
          <select
            className="form-select"
            id="select-empresas"
            value={filtros.empresaId}
            onChange={(e) => onChange("empresaId", e.target.value)}
          >
            <option value="">Todas las empresas</option>
            {opcionesEmpresas.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="select-sucursales">Sucursales</label>
          <select
            className="form-select"
            id="select-sucursales"
            value={filtros.sucursalId}
            onChange={(e) => onChange("sucursalId", e.target.value)}
          >
            <option value="">Todas las sucursales</option>
            {opcionesSucursales.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="select-areas">Área</label>
          <select
            className="form-select"
            id="select-areas"
            value={filtros.areaId}
            onChange={(e) => onChange("areaId", e.target.value)}
          >
            <option value="">Todas las áreas</option>
            {opcionesAreas.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="select-naves">Nave</label>
          <select
            className="form-select"
            id="select-naves"
            value={filtros.naveId}
            onChange={(e) => onChange("naveId", e.target.value)}
          >
            <option value="">Todas las naves</option>
            {opcionesNaves.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>
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
              <option key={d.id} value={d.id}>
                {d.nombre}
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
