// valor: 0-100. onChange(number) se dispara con cada movimiento del slider.
export default function VelocidadSlider({ valor, onChange, disabled = false }) {
  return (
    <div className="pol-panel pol-velocidad">
      <div className="pol-velocidad-header">
        <h3 className="pol-panel-title">Velocidad</h3>
        <span className="pol-velocidad-value">{valor}%</span>
      </div>

      <input
        type="range"
        className="pol-slider"
        min={0}
        max={100}
        value={valor}
        disabled={disabled}
        onChange={(e) => onChange?.(Number(e.target.value))}
        style={{ "--pol-slider-fill": `${valor}%` }}
        aria-label="Velocidad"
      />

      <div className="pol-velocidad-scale">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
