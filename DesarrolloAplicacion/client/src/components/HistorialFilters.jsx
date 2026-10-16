export default function HistorialFilters({
  empresas,
  dispositivos, // { IDDispositivo }
  filtros, // { dispositivoId, fechaInicio, fechaFin }
  onChange, // (field, value) => void
  onDescargarCSV, // () => void
  descargando = false, // opcional: muestra estado de carga en el botón
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
          <h2>Historial</h2>
          <p>Seleccione el dispositivo y el rango de fechas a consultar.</p>
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
              <option key={d.id} value={d.id}>
                {d.nombre}
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
