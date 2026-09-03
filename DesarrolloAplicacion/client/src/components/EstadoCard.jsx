const DIRECCION_ICONO = {
  SUBIENDO: "▲",
  BAJANDO: "▼",
  DETENIDO: "■",
};

// estado: "OPERATIVO" | "DETENIDO" | "ALARMA" | ...
// movimiento: "SUBIENDO" | "BAJANDO" | "DETENIDO"
export default function EstadoCard({ estado, movimiento, carga, altura }) {
  const enFalla = estado !== "OPERATIVO";

  return (
    <div className="pol-panel pol-estado">
      <h3 className="pol-panel-title">Estado</h3>

      <div className={`pol-estado-badge ${enFalla ? "pol-estado-badge--fault" : ""}`}>
        <span className={`pol-led ${enFalla ? "pol-led--fault" : "pol-led--ok"}`} />
        {estado}
      </div>

      <div className="pol-estado-row">
        <span className="pol-estado-label">Movimiento</span>
        <span className="pol-estado-movimiento">
          <span className="pol-estado-movimiento-icono">{DIRECCION_ICONO[movimiento] ?? "■"}</span>
          {movimiento}
        </span>
      </div>

      <div className="pol-estado-metrics">
        <div className="pol-estado-metric">
          <span className="pol-estado-metric-label">Carga</span>
          <span className="pol-estado-metric-value">
            {carga}
            <span className="pol-estado-metric-unit">kg</span>
          </span>
        </div>

        <div className="pol-estado-metric">
          <span className="pol-estado-metric-label">Altura</span>
          <span className="pol-estado-metric-value">
            {altura}
            <span className="pol-estado-metric-unit">m</span>
          </span>
        </div>
      </div>
    </div>
  );
}
