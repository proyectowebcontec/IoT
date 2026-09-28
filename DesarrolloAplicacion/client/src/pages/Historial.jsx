import { useState, useEffect } from "react";
import Header from "../components/Header";
import DashboardNavbar from "../components/DashboardNavbar";
import HistorialFilters from "../components/HistorialFilters";
import HistorialTable from "../components/HistorialTable";

import { monitoreotoCSV } from "../utils/MonitoreotoCsv";
import Service from '../services/Service';

const FILTROS_INICIALES = {
  dispositivoId: "",
  fechaInicio: "",
  fechaFin: "",
};

export default function Historial() {
  const [dispositivos, setDispositivos] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [registros, setRegistros] = useState([]);
  const [descargando, setDescargando] = useState(false);

  // Cargar la lista de dispositivos igual que en Dashboard.jsx
useEffect(() => {

    const fetchDispositivos = async () => {
      try {
        const resDispositivos = await Service.obtenerDispositivos();

        setDispositivos(resDispositivos)
        //console.log(metrics.dispositivos)
      } catch (error) {
        console.error("Error al contar dispositivos:", error);
      }
      
    }
    
    fetchDispositivos()
  }, []);

useEffect(() => {
    if(filtros.fechaInicio!=="" & filtros.fechaInicio !== "" & filtros.fechaFin!==""){
      //console.log("####################################################################")
      handleBuscar();
    }
  }, [filtros]);

  const handleFiltroChange = (field, value) => {
    setFiltros((prev) => ({ ...prev, [field]: value }));
  };

  // TODO: dispara la consulta al backend y llena la tabla, por ejemplo
  // llamando esto desde un botón "Buscar" o cada vez que cambian los filtros:
 const handleBuscar = async () => {
    try {
      const data = await Service.obtenerMonitoreos(filtros.dispositivoId, filtros.fechaInicio, filtros.fechaFin);
      //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
      setRegistros(data);
      //console.log(data)
    } catch (error) {
      console.error("Error al obtener monitoreos:", error);
    } 
 };

  const handleDescargarCSV = async () => {
    // TODO: reemplazar por tu llamada real, por ejemplo:
    setDescargando(true);
    try {
      if (!registros || registros.length === 0) {
        alert("No hay registros para descargar en ese rango.");
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
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al generar el CSV.");
    } finally {
      setDescargando(false);
    }
  };

  return (
    <>
      <Header />

      <main className="content">
        <div className="page-header">
          <div>
            <h1>Historial</h1>
            <p>Consulta y descarga los registros históricos de los dispositivos.</p>
          </div>
        </div>

        <DashboardNavbar />

        <HistorialFilters
          dispositivos={dispositivos}
          filtros={filtros}
          onChange={handleFiltroChange}
          onDescargarCSV={handleDescargarCSV}
          descargando={descargando}
        />

        <HistorialTable registros={registros} />
      </main>
    </>
  );
}
