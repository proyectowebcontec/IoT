import { useMemo, useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import DispositivosResumen from "../components/DispositivosResumen";
import DispositivosFiltros from "../components/DispositivosFiltros";
import DispositivosTable from "../components/DispositivosTable";
import "../styles/dispositivos.css";

import Service from "../services/Service";

import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FILTROS_INICIALES = { 
  empresaId: "",
  sucursalId: "",
  areaId: "",
  naveId: "",
  busqueda: "", 
  estado: "" 
};

const JERARQUIA = ["empresaId", "sucursalId", "areaId", "naveId", "dispositivoId"];

export default function Dispositivos() {
  // TODO: reemplazar con tu fetch real, ej.
  const [dispositivos, setDispositivos] = useState([]);
  // useEffect(() => { fetchDispositivos().then(setDispositivos); }, []);
  const [arbol, setArbol] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  // Cargar la lista de empresas igual que en Dashboard.jsx
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const arbolEmpresas = await Service.obtener_arbol_empresas();
        setArbol(arbolEmpresas);
      } catch (error) {
        console.error("Error al consultar empresas registradas:", error);
        toast.error(`Error: No se encontraron empresas registradas.`, { position: 'top-right' });
      }
    }
    fetchEmpresas();
  }, []);

// -------------------------------------------------------------------------
//       CARGA DINAMICA DE LOS DISPOSITIVOS
// -------------------------------------------------------------------------
  useEffect(() => {

    const fetchDispositivos = async () => {
      try {
        const resDispositivos = await Service.obtenerDispositivosAbsolutos(filtros.empresaId, filtros.sucursalId, filtros.areaId, filtros.naveId);

        setDispositivos(resDispositivos)
      } catch (error) {
        console.error("Error al listar dispositivos:", error);
        toast.error(`Error: No se encontraron dispositivos.`, { position: 'top-right' });
      }
      
    }

    if (!filtros.empresaId){
      return;
    }

    fetchDispositivos();
    
  }, [filtros.empresaId, filtros.sucursalId, filtros.areaId, filtros.naveId, filtros.dispositivoId]);

  const handleFiltroChange = (field, value) => {
    // Si el usuario modifica Empresa, sucursal, area o nave a mano, los que
    // están por debajo en la jerarquía deben reestablecerse
    if (field !== "dispositivoId" && !field.startsWith("fecha")){
      setFiltros((prev) => {
        const next = { ...prev, [field]: value };

        // Reinicia todos los niveles por debajo del campo modificado
        const idx = JERARQUIA.indexOf(field);
        if (idx !== -1) {
          JERARQUIA.slice(idx + 1).forEach((hijo) => {
            next[hijo] = "";
          });
        }
        return next;
      });
      return;
    }

    setFiltros((prev) => ({ ...prev, [field]: value }));
  };

  const dispositivosFiltrados = useMemo(() => {
    return dispositivos.filter((d) => {
      const coincideNombre = d.nombre
        .toLowerCase()
        .includes(filtros.busqueda.trim().toLowerCase());

      const coincideEstado =
        filtros.estado === "" ||
        (filtros.estado === "online" && d.estado === "online") ||
        (filtros.estado === "offline" && d.estado === "offline") ||
        (filtros.estado === "mantenimiento" && d.estado === "mantenimiento");

      return coincideNombre && coincideEstado;
    });
  }, [dispositivos, filtros]);

  const resumen = useMemo(
    () => ({
      total: dispositivos.length,
      conectados: dispositivos.filter((d) => d.estado === "online").length,
      desconectados: dispositivos.filter((d) => d.estado === "offline").length,
      mantenimiento: dispositivos.filter((d) => d.estado === "mantenimiento").length,
    }),
    [dispositivos]
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Dispositivos</h1>
          <p>Estado y mantenimiento de los dispositivos registrados.</p>
        </div>
      </div>

      <DashboardNavbar />

      <DispositivosResumen resumen={resumen} />

      <DispositivosFiltros empresas={arbol} filtros={filtros} onChange={handleFiltroChange} />

      <DispositivosTable dispositivos={dispositivosFiltrados} />
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
        transition={Bounce}
        />
    </>
  );
}
