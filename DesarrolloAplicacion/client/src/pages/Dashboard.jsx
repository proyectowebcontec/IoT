import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import DashboardNavbar from "../components/DashboardNavbar";
import FiltersPanel from "../components/FiltersPanel";
import MetricCards from "../components/MetricCards";
import AveragesGrid from "../components/AveragesGrid";
import ChartsGrid from "../components/ChartsGrid";
import "../styles/dashboard.css";

import { calcularRangoPorPeriodo } from "../utils/ConversorFechas";
import Service from '../services/Service';

import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const FILTROS_INICIALES = {
  dispositivoId: "",
  periodo: "",
  fechaInicio: "",
  fechaFin: "",
};

const INTERVALO_MS = 1000;

export default function Dashboard() {
  const [status, setStatus] = useState(0);
  const [dispositivos, setDispositivos] = useState([]);
  const [isTiempoReal, setIsTiempoReal] = useState(false);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [metrics, setMetrics] = useState({
    dispositivos: undefined,
    variables: 4,
    registros: undefined,
    pulsaciones: undefined,
  });
  const [averages, setAverages] = useState({ v1: undefined, v2: undefined, v3: undefined, v4: undefined });
  const [chartData, setChartData] = useState({
    principal: { type: "line", data: { labels: [], datasets: [] } },
    pulsaciones: { type: "line", data: { labels: [], datasets: [] } },
    voltajeX: { type: "line", data: { labels: [], datasets: [] } },
    voltajeY: { type: "line", data: { labels: [], datasets: [] } },
  });

  const lineaConfig = (label, mediciones) => ({
    type: "line",
    data: {
      labels: mediciones.fechas,
      datasets: [{ label, data: mediciones.valores }],
    },
  });

  // Formatea un promedio sin perder el valor 0
  const formatoPromedio = (r) =>
    r?.promedio != null ? Number(r.promedio).toFixed(4) : undefined;

  // Guarda la "huella" de la última ventana de datos para no redibujar si no cambió
  const ultimaVentanaRef = useRef(null);


  useEffect(() => {

    const fetchDispositivos = async () => {
      try {
        const noDispositivos = await Service.obtenerConteoDispositivos();

        const noMonitoreos = await Service.obtenerNoMonitoreos();

        const resDispositivos = await Service.obtenerDispositivos();

        //console.log(resDispositivos)
        setMetrics(prev => ({
          ...prev,
          dispositivos: noDispositivos.totalDispositivos,
          registros: noMonitoreos.total_monitoreos
        }));

        setDispositivos(resDispositivos)
        //console.log(metrics.dispositivos)
      } catch (error) {
        console.error("Error al contar dispositivos:", error);
        toast.error(`Error: No se encontraron dispositivos.`, { position: 'top-right' });
      }
      
    }

    const fetchStatus = async () => {
      try {
        const estado = await Service.is_connected();

        setStatus(estado);
        toast.success("Sistema activado exitósamente", { position: "top-right", });
      } catch (error) {
        console.error("Error al verificar salud de la API", error);
        toast.error(`Error: El sistema no está disponible.`, { position: 'top-right' });
      }
    }
    
    fetchDispositivos()
    fetchStatus()
  }, []);

  useEffect(() => {
    if (!isTiempoReal || filtros.dispositivoId === "") return;

    const dispositivoId = filtros.dispositivoId;
    let activo = true;
    let timer;
    ultimaVentanaRef.current = null;

    // setTimeout encadenado: la siguiente consulta empieza cuando termina la anterior
    const ciclo = async () => {
      if (!document.hidden) {
        await cargarDatosTiempoReal(dispositivoId, () => activo);
      }
      if (activo) timer = setTimeout(ciclo, INTERVALO_MS);
    };

    ciclo();

    return () => {
      activo = false;
      clearTimeout(timer);
    };
  }, [isTiempoReal, filtros.dispositivoId]);

  const cargarDatosTiempoReal = async (dispositivoId, sigueActivo) => {
    try {
      // Todas las peticiones en paralelo
      const [
        noMonitoreos,
        noPulsaciones,
        avgU1, avgU2, avgU3,
        dataU1, dataU2, dataU3, dataDI3,
      ] = await Promise.all([
        Service.obtenerNoMonitoreos(),
        Service.obtenerConteoPulsacionesTR(dispositivoId, "DI3"),
        Service.obtenerPromedioVariableTR(dispositivoId, "U1"),
        Service.obtenerPromedioVariableTR(dispositivoId, "U2"),
        Service.obtenerPromedioVariableTR(dispositivoId, "U3"),
        Service.obtenerDashboardTR(dispositivoId, "U1"),
        Service.obtenerDashboardTR(dispositivoId, "U2"),
        Service.obtenerDashboardTR(dispositivoId, "U3"),
        Service.obtenerDashboardTR(dispositivoId, "DI3"),
      ]);

      // Si el usuario cambia de dispositivo o sale del modo tiempo real, ignorar
      if (!sigueActivo()) return;

      const mU1 = extraerDatos(dataU1);
      const mU2 = extraerDatos(dataU2);
      const mU3 = extraerDatos(dataU3);
      const mDI3 = extraerDatos(dataDI3);

      // Actualizar todo junto en un solo render
      setMetrics((prev) => ({
        ...prev,
        registros: noMonitoreos?.total_monitoreos,
        pulsaciones: noPulsaciones?.total,
      }));

      setAverages({
        v1: formatoPromedio(avgU1),
        v2: formatoPromedio(avgU2),
        v3: formatoPromedio(avgU3),
      });

      // Las gráficas se actualizan solo si llegan datos nuevos
      const ventana = `${mU1.fechas[0]}|${mU1.fechas.at(-1)}|${mDI3.fechas.at(-1)}`;
      if (ventana === ultimaVentanaRef.current) return;
      ultimaVentanaRef.current = ventana;

      setChartData({
        principal: lineaConfig("U1", mU1),
        pulsaciones: lineaConfig("DI3", mDI3),
        voltajeX: lineaConfig("U2", mU2),
        voltajeY: lineaConfig("U3", mU3),
      });
    } catch (error) {
      console.error("Error cargando datos en tiempo real:", error);
      toast.error(`Error: No se pueden mostrar los datos en tiempo real.`, { position: 'top-right' });
    }
  };

  const handleFiltroChange = (field, value) => {
    if (field === "periodo") {

      if(value === "tr"){

        setFiltros((prev) => ({
          ...prev,
          periodo: value,
          fechaInicio: "",
          fechaFin: "",
        }));

        setIsTiempoReal(true)

        return;
      }

      const rango = calcularRangoPorPeriodo(value);

      setFiltros((prev) => ({
        ...prev,
        periodo: value,
        fechaInicio: rango ? rango.fechaInicio : prev.fechaInicio,
        fechaFin: rango ? rango.fechaFin : prev.fechaFin,
      }));

      setIsTiempoReal(false);
      return;
    }

    // Si el usuario edita "Desde"/"Hasta" a mano, el período rápido deja de
    // aplicar (ya no refleja lo que está escrito en los inputs de fecha).
    if (field === "fechaInicio" || field === "fechaFin") {
      setFiltros((prev) => ({ ...prev, [field]: value, periodo: "" }));
      setIsTiempoReal(false);
      return;
    }

    setFiltros((prev) => ({ ...prev, [field]: value }));
  };

  const handleLimpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
  };

  function extraerDatos(mediciones) {
    const fechas = mediciones.map(medicion => medicion.fecha);
    const valores = mediciones.map(medicion => medicion.valor);
    
    return { fechas, valores };
  }

  const handleAplicarFiltros = async () => {
    if (filtros.dispositivoId === "") {
      toast.error("Error: Debe indicar un dispositivo.", {position:'top-right'})
      return;
    }

    // Tiempo real
    if (isTiempoReal) {
      return;
    }

    try {
      //Conteo de pulsaciones
      const noPulsaciones = await Service.obtenerConteoPulsaciones(filtros.dispositivoId, "DI3", filtros.fechaInicio, filtros.fechaFin);
      //console.log(noPulsaciones)
      setMetrics(prev => ({
        ...prev,
        pulsaciones: noPulsaciones ? noPulsaciones.total : undefined
      }));

      // Obener los promedios de las variables observadas
      const avgEntradaU1 = await Service.obtenerPromedioVariable(filtros.dispositivoId, "U1", filtros.fechaInicio, filtros.fechaFin)
      const avgEntradaU2 = await Service.obtenerPromedioVariable(filtros.dispositivoId, "U2", filtros.fechaInicio, filtros.fechaFin)
      const avgEntradaU3 = await Service.obtenerPromedioVariable(filtros.dispositivoId, "U3", filtros.fechaInicio, filtros.fechaFin)
      //console.log(avgEntradaU1)

      setAverages({
        v1: avgEntradaU1.promedio ? avgEntradaU1.promedio.toFixed(4) : undefined,
        v2: avgEntradaU2.promedio ? avgEntradaU2.promedio.toFixed(4) : undefined, 
        v3: avgEntradaU3.promedio ? avgEntradaU3.promedio.toFixed(4) : undefined})

      // Gráficos
      const dataU1 = await Service.obtenerDashboard(filtros.dispositivoId, "U1", filtros.fechaInicio, filtros.fechaFin)
      const medicionesU1 = extraerDatos(dataU1);
      
      const dataU2 = await Service.obtenerDashboard(filtros.dispositivoId, "U2", filtros.fechaInicio, filtros.fechaFin)
      const medicionesU2 = extraerDatos(dataU2);
      
      const dataU3 = await Service.obtenerDashboard(filtros.dispositivoId, "U3", filtros.fechaInicio, filtros.fechaFin)
      const medicionesU3 = extraerDatos(dataU3);
      
      const dataDI3 = await Service.obtenerDashboard(filtros.dispositivoId, "DI3", filtros.fechaInicio, filtros.fechaFin)
      const medicionesDI3 = extraerDatos(dataDI3);

      setChartData({
        principal: {
          type: "line",
          data: {
            labels: medicionesU1.fechas,
            datasets: [
              {
                label: "U1",
                data: medicionesU1.valores,
              }
            ]
          }
        },

        pulsaciones: {
          type: "line",
          data: {
            labels: medicionesDI3.fechas,
            datasets: [
              {
                label: "DI3",
                data: medicionesDI3.valores,
              }
            ]
          }
        },

        voltajeX: {
          type: "line",
          data: {
            labels: medicionesU2.fechas,
            datasets: [
              {
                label: "U2",
                data: medicionesU2.valores,
              }
            ]
          }
        },

        voltajeY: {
          type: "line",
          data: {
            labels: medicionesU3.fechas,
            datasets: [
              {
                label: "U3",
                data: medicionesU3.valores,
              }
            ]
          }
        }
      });
      
    } catch (error) {
      console.error("Error en consultas filtradas:", error);
      toast.error(`Error: No se aplicaron los filtros.`, { position: 'top-right' });
    }
  };

  return (
    <>
      <Header status={status} />

      <main className="content">
        <div className="page-header">
          <div>
            <h1>Dashboard de monitoreo</h1>
            <p>Visualización en tiempo real de dispositivos y variables industriales.</p>
          </div>
        </div>

        <DashboardNavbar />

        <FiltersPanel
          dispositivos={dispositivos}
          filtros={filtros}
          onChange={handleFiltroChange}
          onAplicar={handleAplicarFiltros}
          onLimpiar={handleLimpiarFiltros}
        />

        <MetricCards metrics={metrics} />

        <AveragesGrid averages={averages} />

        <ChartsGrid chartData={chartData} />
      </main>
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
        transition: Bounce
        />
    </>
  );
}
