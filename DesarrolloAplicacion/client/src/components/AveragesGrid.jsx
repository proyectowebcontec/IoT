function AverageCard({ iconClass, iconLabel, label, value }) {
  return (
    <div className="average-card">
      <div className={`average-icon ${iconClass}`}>{iconLabel}</div>

      <div>
        <div className="average-label">{label}</div>
        <div className="average-value">{value ?? "----"}</div>
      </div>
    </div>
  );
}

// averages: { v1, v2, v3, v4 }
export default function AveragesGrid({ averages }) {
  const cards = [
    { icon: "average-blue", tag: "V1", label: "Promedio Variable 1", value: averages.v1 },
    { icon: "average-orange", tag: "V2", label: "Promedio Variable 2", value: averages.v2 },
    { icon: "average-yellow", tag: "V3", label: "Promedio Variable 3", value: averages.v3 },
    { icon: "average-gray", tag: "V4", label: "Promedio Variable 4", value: averages.v4 },
  ];

  return (
    <section className="section-block">
      <div className="section-header">
        <div>
          <h2>Promedios de variables</h2>
          <p>Valores promedio para el período seleccionado.</p>
        </div>
      </div>

      <div className="averages-grid">
        {cards.map((c) => (
          <AverageCard
            key={c.tag}
            iconClass={c.icon}
            iconLabel={c.tag}
            label={c.label}
            value={c.value}
          />
        ))}
      </div>
    </section>
  );
}
