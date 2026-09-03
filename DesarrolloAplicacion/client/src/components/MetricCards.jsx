function MetricCard({ colorClass, label, value, description }) {
  return (
    <div className={`metric-card ${colorClass}`}>
      <div className="metric-card-header">
        <span>{label}</span>
      </div>

      <div className="metric-value">{value ?? "----"}</div>

      <div className="metric-description">{description}</div>
    </div>
  );
}

// metrics: { dispositivos, variables, registros, pulsaciones }
export default function MetricCards({ metrics }) {
  return (
    <section className="cards-grid">
      <MetricCard
        colorClass="blue-card"
        label="Dispositivos"
        value={metrics.dispositivos}
        description="Dispositivos registrados"
      />

      <MetricCard
        colorClass="orange-card"
        label="Variables"
        value={metrics.variables ?? 4}
        description="Variables monitoreadas"
      />

      <MetricCard
        colorClass="yellow-card"
        label="Registros"
        value={metrics.registros}
        description="Registros encontrados"
      />

      <MetricCard
        colorClass="gray-card"
        label="Pulsaciones"
        value={metrics.pulsaciones}
        description="Pulsaciones registradas"
      />
    </section>
  );
}
