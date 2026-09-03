// Todos los handlers son opcionales — pásalos desde el componente padre
// cuando conectes la lógica real (ej. onSubir={() => enviarComando('up')}).
export default function ControlPad({
  onSubir,
  onBajar,
  onIzquierda,
  onDerecha,
  onStop,
  disabled = false,
}) {
  return (
    <div className="pol-panel pol-control">
      <h3 className="pol-panel-title">Control</h3>

      <div className="pol-dpad">
        <button
          type="button"
          className="pol-dpad-btn pol-dpad-btn--up"
          onClick={onSubir}
          disabled={disabled}
          aria-label="Subir"
        >
          <span className="pol-dpad-icon">▲</span>
          <span className="pol-dpad-text">SUBIR</span>
        </button>

        <button
          type="button"
          className="pol-dpad-btn pol-dpad-btn--left"
          onClick={onIzquierda}
          disabled={disabled}
          aria-label="Izquierda"
        >
          <span className="pol-dpad-icon">◀</span>
        </button>

        <button
          type="button"
          className="pol-dpad-btn pol-dpad-btn--stop"
          onClick={onStop}
          aria-label="Stop"
        >
          <span className="pol-dpad-icon">■</span>
          <span className="pol-dpad-text">STOP</span>
        </button>

        <button
          type="button"
          className="pol-dpad-btn pol-dpad-btn--right"
          onClick={onDerecha}
          disabled={disabled}
          aria-label="Derecha"
        >
          <span className="pol-dpad-icon">▶</span>
        </button>

        <button
          type="button"
          className="pol-dpad-btn pol-dpad-btn--down"
          onClick={onBajar}
          disabled={disabled}
          aria-label="Bajar"
        >
          <span className="pol-dpad-icon">▼</span>
          <span className="pol-dpad-text">BAJAR</span>
        </button>
      </div>
    </div>
  );
}
