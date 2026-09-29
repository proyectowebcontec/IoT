export default function Header() {
  return (
    <header className="header">
      <div>
        <div className="logo">
          <img src="../../Logo-naranja.png" height={50} width={150}></img>
        </div>
        <div className="header-subtitle">Integración Digital</div>
      </div>

      <div className="header-status">
        <span className="status-indicator"></span>
        Sistema de monitoreo
      </div>
    </header>
  );
}
