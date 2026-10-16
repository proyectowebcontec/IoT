export default function DispositivosFiltros({
  empresas,
  filtros, // { busqueda, estado } -- estado: "" | "conectado" | "desconectado"
  onChange, // (field, value) => void
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
          <h2>Dispositivos</h2>
          <p>Busque por nombre o filtre por estado de conexión.</p>
        </div>
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
            <option key="online" value="online">Conectado</option>
            <option key="offline" value="offline">Desconectado</option>
            <option key="mantenimiento" value="mantenimiento">Mantenimiento</option>
          </select>
        </div>
      </div>
    </section>
  );
}
