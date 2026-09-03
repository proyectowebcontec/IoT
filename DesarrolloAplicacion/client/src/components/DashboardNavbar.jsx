import { NavLink } from "react-router-dom";

// Assumes react-router-dom is set up with routes:
//   "/"                 -> Dashboard
//   "/dispositivos"     -> Dispositivos
//   "/historial"        -> Historial
// Swap the NavLink "to" values for plain hrefs if you're not using a router.
export default function DashboardNavbar() {
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar navbar-expand-lg dashboard-navbar">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          CONTEC IoT
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink end className={linkClass} to="/" aria-current="page">
              Dashboard
            </NavLink>
            <NavLink className={linkClass} to="/dispositivos">
              Dispositivos
            </NavLink>
            <NavLink className={linkClass} to="/historial">
              Historial
            </NavLink>
            <NavLink className={linkClass} to="/simulador">
              Simulador ABUS
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
