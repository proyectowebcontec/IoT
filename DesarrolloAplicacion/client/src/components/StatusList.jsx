// items: [{ id, label, ok }]  -> ok=true muestra LED verde, ok=false LED rojo
export default function StatusList({ title, items }) {
  return (
    <div className="pol-panel">
      <h3 className="pol-panel-title">{title}</h3>

      <ul className="pol-status-list">
        {items.map((item) => (
          <li key={item.id} className="pol-status-row">
            <span className={`pol-led ${item.ok ? "pol-led--ok" : "pol-led--fault"}`} />
            <span className="pol-status-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
