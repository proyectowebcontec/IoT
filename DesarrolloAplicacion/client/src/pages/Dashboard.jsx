import { useEffect, useState, useRef } from "react";
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
  empresaId: "",
  sucursalId: "",
  areaId: "",
  naveId: "",
  dispositivoId: "",
  periodo: "",
  fechaInicio: "",
  fechaFin: "",
};

const INTERVALO_MS = 1000;

const JERARQUIA = ["empresaId", "sucursalId", "areaId", "naveId", "dispositivoId"];

export default function Dashboard() {
  const [dispositivos, setDispositivos] = useState([]);
  const [arbol, setArbol] = useState([]);
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

// -------------------------------------------------------------------------
//       CARGA INICIAL DE LOS DATOS GENERALES (empresas, sucursales, áreas y naves)
// -------------------------------------------------------------------------
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
//       CARGA DINAMICA DE LOS DATOS GENERALES (dispositivos, cantidad de dispositivos y registros)
// -------------------------------------------------------------------------
  useEffect(() => {

    const fetchDispositivos = async () => {
      try {
        const noDispositivos = await Service.obtener_conteo_ubicacion(filtros.empresaId, filtros.sucursalId, filtros.areaId, filtros.naveId);

        const noMonitoreos = await Service.obtenerNoMonitoreos(filtros.empresaId, filtros.sucursalId, filtros.areaId, filtros.naveId, filtros.dispositivoId);

        const resDispositivos = await Service.obtener_dispositivos_ubicacion(filtros.empresaId, filtros.sucursalId, filtros.areaId, filtros.naveId);

        //console.log(resDispositivos)
        setMetrics(prev => ({
          ...prev,
          dispositivos: noDispositivos.total_dispositivos,
          registros: noMonitoreos.total_monitoreos
        }));

        setDispositivos(resDispositivos)
        //console.log(metrics.dispositivos)
      } catch (error) {
        console.error("Error al contar dispositivos:", error);
        toast.error(`Error: No se encontraron dispositivos.`, { position: 'top-right' });
      }
      
    }

    if (!filtros.empresaId){
      return;
    }

    fetchDispositivos();
    
  }, [filtros.empresaId, filtros.sucursalId, filtros.areaId, filtros.naveId, filtros.dispositivoId]);

// -------------------------------------------------------------------------
//       CARGA EN TIEMPO REAL (graficos, promedios y cantidades)
// -------------------------------------------------------------------------
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
        avgData,
        dataU1,
      ] = await Promise.all([
        Service.obtenerNoMonitoreos(filtros.empresaId, filtros.sucursalId, filtros.areaId, filtros.naveId, dispositivoId),
        Service.obtenerConteoPulsacionesTR(dispositivoId, "DI3"),
        Service.obtenerPromedioVariableTR(dispositivoId),
        Service.obtener_ultimos_monitoreos(dispositivoId),
      ]);

      // Si el usuario cambia de dispositivo o sale del modo tiempo real, ignorar
      if (!sigueActivo()) return;

      const mediciones = extraerDatos(dataU1);

      // Actualizar todo junto en un solo render
      setMetrics((prev) => ({
        ...prev,
        registros: noMonitoreos?.total_monitoreos,
        pulsaciones: noPulsaciones?.total,
      }));

      setAverages({
        v1: formatoPromedio(avgData["promedios"][0]),
        v2: formatoPromedio(avgData["promedios"][1]),
        v3: formatoPromedio(avgData["promedios"][2]),
      });

      // Las gráficas se actualizan solo si llegan datos nuevos
      const ventana = `${mediciones[1].fechas[0]}|${mediciones[1].fechas.at(-1)}|${mediciones[4].fechas.at(-1)}`;
      if (ventana === ultimaVentanaRef.current) return;
      ultimaVentanaRef.current = ventana;

      setChartData({
        principal: lineaConfig("U1", mediciones[1]),
        pulsaciones: lineaConfig("DI3", mediciones[4]),
        voltajeX: lineaConfig("U2", mediciones[2]),
        voltajeY: lineaConfig("U3", mediciones[3]),
      });
    } catch (error) {
      console.error("Error cargando datos en tiempo real:", error);
      toast.error(`Error: No se pueden mostrar los datos en tiempo real.`, { position: 'top-right' });
    }
  };

// -------------------------------------------------------------------------
//       SELECCIÓN DE FILTROS (dispositivos y fechas)
// -------------------------------------------------------------------------
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

    // Si el usuario modifica Empresa, sucursal, area o nave a mano, los que
    // están por debajo en la jerarquía deben reestablecerse
    if (field !== "dispositivoId"){
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
    }

    setFiltros((prev) => ({ ...prev, [field]: value }));
  };

  const handleLimpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
  };

  function extraerDatos(respuesta) {
    const porEntrada = {};

    for (const lectura of respuesta) {
      for (const m of lectura.mediciones) {
        const entrada = (porEntrada[m.canal] ??= { fechas: [], valores: [] });
        entrada.fechas.push(lectura.fecha_monitoreo);
        entrada.valores.push(m.valor);
      }
    }

    return porEntrada;
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
      const avgEntradas = await Service.obtenerPromedioVariable(filtros.dispositivoId, filtros.fechaInicio, filtros.fechaFin);
      //console.log(avgEntradas)

      setAverages({
        v1: avgEntradas[0].promedio ? avgEntradas[0].promedio.toFixed(4) : undefined,
        v2: avgEntradas[1].promedio ? avgEntradas[1].promedio.toFixed(4) : undefined, 
        v3: avgEntradas[2].promedio ? avgEntradas[2].promedio.toFixed(4) : undefined})

      // Gráficos
      const monitoreos = await Service.obtener_monitoreos_por_rango(filtros.dispositivoId, filtros.fechaInicio, filtros.fechaFin);
      const mediciones = extraerDatos(monitoreos)

      setChartData({
        principal: {
          type: "line",
          data: {
            labels: mediciones[1].fechas,
            datasets: [
              {
                label: "U1",
                data: mediciones[1].valores,
              }
            ]
          }
        },

        pulsaciones: {
          type: "line",
          data: {
            labels: mediciones[4].fechas,
            datasets: [
              {
                label: "DI3",
                data: mediciones[4].valores,
              }
            ]
          }
        },

        voltajeX: {
          type: "line",
          data: {
            labels: mediciones[2].fechas,
            datasets: [
              {
                label: "U2",
                data: mediciones[2].valores,
              }
            ]
          }
        },

        voltajeY: {
          type: "line",
          data: {
            labels: mediciones[3].fechas,
            datasets: [
              {
                label: "U3",
                data: mediciones[3].valores,
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
        <div className="page-header">
          <div>
            <h1>Dashboard de monitoreo</h1>
            <p>Visualización en tiempo real de dispositivos y variables industriales.</p>
          </div>
        </div>

        <DashboardNavbar />

        <FiltersPanel
          empresas={arbol}
          dispositivos={dispositivos}
          filtros={filtros}
          onChange={handleFiltroChange}
          onAplicar={handleAplicarFiltros}
          onLimpiar={handleLimpiarFiltros}
        />

      <MetricCards metrics={metrics} />

      <AveragesGrid averages={averages} />

      <ChartsGrid chartData={chartData} />
    
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
