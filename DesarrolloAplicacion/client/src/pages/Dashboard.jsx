import { useEffect, useState } from "react";
import Header from "../components/Header";
import DashboardNavbar from "../components/DashboardNavbar";
import FiltersPanel from "../components/FiltersPanel";
import MetricCards from "../components/MetricCards";
import AveragesGrid from "../components/AveragesGrid";
import ChartsGrid from "../components/ChartsGrid";

import { calcularRangoPorPeriodo } from "../utils/ConversorFechas";
import Service from '../services/Service';

const FILTROS_INICIALES = {
  dispositivoId: "",
  periodo: "",
  fechaInicio: "",
  fechaFin: "",
};

export default function Dashboard() {
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
      }
      
    }
    
    fetchDispositivos()
  }, []);

  useEffect(() => {
    if (!isTiempoReal || filtros.dispositivoId === "") {
      return;
    }

    // Cargar inmediatamente
    cargarDatosTiempoReal();

    // Luego cada 10 segundos
    const intervalo = setInterval(() => {
      cargarDatosTiempoReal();
    }, 10000);

    // Limpiar el intervalo
    return () => {
      clearInterval(intervalo);
    };

  }, [isTiempoReal, filtros.dispositivoId]);

  const cargarDatosTiempoReal = async () => {
    if (filtros.dispositivoId === "") return;

    try {
      // Actualizar cantidad de registros
      const noMonitoreos = await Service.obtenerNoMonitoreos();

      //Conteo de pulsaciones
      const noPulsaciones = await Service.obtenerConteoPulsacionesTR(filtros.dispositivoId, "DI3");
      //console.log(noPulsaciones)
      setMetrics(prev => ({
        ...prev,
        registros: noMonitoreos.total_monitoreos,
        pulsaciones: noPulsaciones.total
      }));

      // Obener los promedios de las variables observadas
      const avgEntradaU1 = await Service.obtenerPromedioVariableTR(filtros.dispositivoId, "U1")
      const avgEntradaU2 = await Service.obtenerPromedioVariableTR(filtros.dispositivoId, "U2")
      const avgEntradaU3 = await Service.obtenerPromedioVariableTR(filtros.dispositivoId, "U3")
      //console.log(avgEntradaU1)

      setAverages({
        v1: avgEntradaU1.promedio ? avgEntradaU1.promedio.toFixed(4) : undefined,
        v2: avgEntradaU2.promedio ? avgEntradaU2.promedio.toFixed(4) : undefined, 
        v3: avgEntradaU3.promedio ? avgEntradaU3.promedio.toFixed(4) : undefined})

      // Gráficos     
      const dataU1 = await Service.obtenerDashboardTR(
        filtros.dispositivoId,
        "U1"
      );

      const dataU2 = await Service.obtenerDashboardTR(
        filtros.dispositivoId,
        "U2"
      );

      const dataU3 = await Service.obtenerDashboardTR(
        filtros.dispositivoId,
        "U3"
      );

      const dataDI3 = await Service.obtenerDashboardTR(
        filtros.dispositivoId,
        "DI3"
      );

      const medicionesU1 = extraerDatos(dataU1);
      const medicionesU2 = extraerDatos(dataU2);
      const medicionesU3 = extraerDatos(dataU3);
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
              },
            ],
          },
        },

        pulsaciones: {
          type: "line",
          data: {
            labels: medicionesDI3.fechas,
            datasets: [
              {
                label: "DI3",
                data: medicionesDI3.valores,
              },
            ],
          },
        },

        voltajeX: {
          type: "line",
          data: {
            labels: medicionesU2.fechas,
            datasets: [
              {
                label: "U2",
                data: medicionesU2.valores,
              },
            ],
          },
        },

        voltajeY: {
          type: "line",
          data: {
            labels: medicionesU3.fechas,
            datasets: [
              {
                label: "U3",
                data: medicionesU3.valores,
              },
            ],
          },
        },
      });

    } catch (error) {
      console.error("Error cargando datos en tiempo real:", error);
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
        pulsaciones: noPulsaciones.total
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
    }
  };

  return (
    <>
      <Header />

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
    </>
  );
}
