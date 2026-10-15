import { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import HistorialFilters from "../components/HistorialFilters";
import HistorialTable from "../components/HistorialTable";

import { monitoreotoCSV } from "../utils/MonitoreotoCsv";
import Service from '../services/Service';

import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FILTROS_INICIALES = {
  empresaId: "",
  sucursalId: "",
  areaId: "",
  naveId: "",
  dispositivoId: "",
  fechaInicio: "",
  fechaFin: "",
};

const JERARQUIA = ["empresaId", "sucursalId", "areaId", "naveId", "dispositivoId"];

export default function Historial() {
  const [arbol, setArbol] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [registros, setRegistros] = useState([]);
  const [descargando, setDescargando] = useState(false);

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

useEffect(() => {
    if(filtros.fechaInicio!=="" & filtros.fechaInicio !== "" & filtros.fechaFin!==""){
      //console.log("####################################################################")
      if (filtros.dispositivoId === ''){
        toast.error("Error: Debe indicar un dispositivo.", {position:'top-right'})
        return;
      }

      handleBuscar();
    }
  }, [filtros.fechaFin, filtros.fechaInicio, filtros.dispositivoId]);

  // -------------------------------------------------------------------------
  //       CARGA DINAMICA DE LOS DISPOSITIVOS
  // -------------------------------------------------------------------------
    useEffect(() => {
  
      const fetchDispositivos = async () => {
        try {
          const resDispositivos = await Service.obtener_dispositivos_resumen(filtros.empresaId, filtros.sucursalId, filtros.areaId, filtros.naveId);
  
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

 const handleBuscar = async () => {
    try {
      const data = await Service.obtenerMonitoreosAbsolutos(filtros.dispositivoId, filtros.fechaInicio, filtros.fechaFin);
      //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
      setRegistros(data);
      //console.log(data)
    } catch (error) {
      setRegistros([])
      console.error("Error al obtener monitoreos:", error);
      toast.error(`Error:  Al consultar todos los monitoreos.`, { position: 'top-right' });
    } 
 };

  const handleDescargarCSV = async () => {
    // TODO: reemplazar por tu llamada real, por ejemplo:
    setDescargando(true);
    try {
      if (!registros || registros.length === 0) {
        toast.info("No hay registros para descargar en ese rango.",{position:'top-right'});
        return;
      }

      const csv = monitoreotoCSV(registros);

      // BOM para que Excel detecte UTF-8 correctamente (tildes, ñ, etc.)
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `historial-${filtros.dispositivoId || "todos"}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("CSV generado con éxito", { position: 'top-right' })
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al generar el CSV.", { position: 'top-right' });
    } finally {
      setDescargando(false);
    }
  };

  return (
    <>
        <div className="page-header">
          <div>
            <h1>Historial</h1>
            <p>Consulta y descarga los registros históricos de los dispositivos.</p>
          </div>
        </div>

        <DashboardNavbar />

        <HistorialFilters
          empresas={arbol}
          dispositivos={dispositivos}
          filtros={filtros}
          onChange={handleFiltroChange}
          onDescargarCSV={handleDescargarCSV}
          descargando={descargando}
        />

        <HistorialTable registros={registros} />
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
    </>
  );
}
