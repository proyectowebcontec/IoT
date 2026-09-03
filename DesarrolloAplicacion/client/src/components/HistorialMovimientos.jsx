const DIRECCION_ICONO = {
  Subir: "▲",
  Bajar: "▼",
  Stop: "■",
  Izquierda: "◀",
  Derecha: "▶",
};

// movimientos: [{ id, hora, accion, duracion }]  duracion puede ser null/undefined -> se muestra "—"
export default function HistorialMovimientos({ movimientos }) {
  return (
    <div className="pol-panel pol-historial">
      <h3 className="pol-panel-title">Últimos movimientos</h3>

      <ul className="pol-historial-list">
        {movimientos.map((m) => (
          <li key={m.id} className="pol-historial-row">
            <span className="pol-historial-hora">{m.hora}</span>

            <span className="pol-historial-accion">
              <span className="pol-historial-icono">{DIRECCION_ICONO[m.accion] ?? "■"}</span>
              {m.accion}
            </span>

            <span className="pol-historial-duracion">{m.duracion ?? "—"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
