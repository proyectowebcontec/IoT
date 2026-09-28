import { useMemo, useState } from "react";
import Header from "../components/Header";
import DashboardNavbar from "../components/DashboardNavbar";
import DispositivosResumen from "../components/DispositivosResumen";
import DispositivosFiltros from "../components/DispositivosFiltros";
import DispositivosTable from "../components/DispositivosTable";
import "../styles/dispositivos.css";

const FILTROS_INICIALES = { busqueda: "", estado: "" };

export default function Dispositivos() {
  // TODO: reemplazar con tu fetch real, ej.
  // const [dispositivos, setDispositivos] = useState([]);
  // useEffect(() => { fetchDispositivos().then(setDispositivos); }, []);
  const [dispositivos] = useState([
    { id: 1, nombre: "Sensor planta 2", conectado: true, ultimoMantenimiento: "12/08/2026", ultimaConexion: "Hace 3 min" },
    { id: 2, nombre: "Sensor planta 3", conectado: false, ultimoMantenimiento: "02/07/2026", ultimaConexion: "Hace 2 días" },
  ]);

  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  const handleFiltroChange = (field, value) => {
    setFiltros((prev) => ({ ...prev, [field]: value }));
  };

  const dispositivosFiltrados = useMemo(() => {
    return dispositivos.filter((d) => {
      const coincideNombre = d.nombre
        .toLowerCase()
        .includes(filtros.busqueda.trim().toLowerCase());

      const coincideEstado =
        filtros.estado === "" ||
        (filtros.estado === "conectado" && d.conectado) ||
        (filtros.estado === "desconectado" && !d.conectado);

      return coincideNombre && coincideEstado;
    });
  }, [dispositivos, filtros]);

  const resumen = useMemo(
    () => ({
      total: dispositivos.length,
      conectados: dispositivos.filter((d) => d.conectado).length,
      desconectados: dispositivos.filter((d) => !d.conectado).length,
    }),
    [dispositivos]
  );

  return (
    <>
      <Header />

      <main className="content">
        <div className="page-header">
          <div>
            <h1>Dispositivos</h1>
            <p>Estado y mantenimiento de los dispositivos registrados.</p>
          </div>
        </div>

        <DashboardNavbar />

        <DispositivosResumen resumen={resumen} />

        <DispositivosFiltros filtros={filtros} onChange={handleFiltroChange} />

        <DispositivosTable dispositivos={dispositivosFiltrados} />
      </main>
    </>
  );
}
