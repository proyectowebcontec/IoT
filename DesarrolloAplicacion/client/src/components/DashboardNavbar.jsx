import { NavLink } from "react-router-dom";

import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DashboardNavbar() {
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const handleLogout = () => {
      localStorage.removeItem('userId'); // Elimina el usuario logeado
      localStorage.removeItem('token'); // Elimina el token
      //console.log("FUERA!!!")
      toast.success('Has cerrado sesión', {position: 'top-right'});
  };


  return (
    <nav className="navbar navbar-expand-lg dashboard-navbar">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/dashboardadmin">
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
            <NavLink end className={linkClass} to="/dashboardadmin" aria-current="page">
              Dashboard
            </NavLink>
            <NavLink className={linkClass} to="/dashboardadmin/dispositivos">
              Dispositivos
            </NavLink>
            <NavLink className={linkClass} to="/dashboardadmin/historial">
              Historial
            </NavLink>
            <NavLink className={linkClass} to="/dashboardadmin/simulador">
              Simulador ABUS
            </NavLink>
            <NavLink className={linkClass} to="/" onClick={handleLogout}>
              Salir
            </NavLink>
          </div>
        </div>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition= {Bounce}
        />
    </nav>
  );
}
