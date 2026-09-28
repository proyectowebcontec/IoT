function ResumenCard({ colorClass, label, value }) {
  return (
    <div className={`metric-card ${colorClass}`}>
      <div className="metric-card-header">
        <span>{label}</span>
      </div>

      <div className="metric-value">{value ?? "----"}</div>
    </div>
  );
}

// resumen: { total, conectados, desconectados }
export default function DispositivosResumen({ resumen }) {
  return (
    <section className="cards-grid cards-grid--3">
      <ResumenCard colorClass="blue-card" label="Total de dispositivos" value={resumen.total} />
      <ResumenCard colorClass="green-card" label="Conectados" value={resumen.conectados} />
      <ResumenCard colorClass="red-card" label="Desconectados" value={resumen.desconectados} />
    </section>
  );
}
