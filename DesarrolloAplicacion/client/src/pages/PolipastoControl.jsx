import EstadoCard from "../components/EstadoCard";
import ControlPad from "../components/ControlPad";
import VelocidadSlider from "../components/VelocidadSlider";
import StatusList from "../components/StatusList";
import HistorialMovimientos from "../components/HistorialMovimientos";
import Header from "../components/Header";
import DashboardNavbar from "../components/DashboardNavbar";
import "../styles/polipasto.css";

// Todos los datos y handlers llegan por props — este componente es puramente
// de presentación. Los valores por defecto solo sirven de vista previa.
export default function PolipastoControl({
  conectado = true,
  estado = "OPERATIVO",
  movimiento = "SUBIENDO",
  carga = 320,
  altura = 4.25,
  velocidad = 45,
  onVelocidadChange,
  limites = [
    { id: "sup", label: "Superior", ok: true },
    { id: "inf", label: "Inferior", ok: true },
    { id: "izq", label: "Izquierda", ok: true },
    { id: "der", label: "Derecha", ok: true },
  ],
  alarmas = [
    { id: "sobrecarga", label: "Sobrecarga", ok: true },
    { id: "motor", label: "Motor", ok: true },
    { id: "comunicacion", label: "Comunicación", ok: true },
    { id: "emergencia", label: "Emergencia", ok: true },
  ],
  historial = [
    { id: 1, hora: "13:42", accion: "Subir", duracion: "8.4 s" },
    { id: 2, hora: "13:43", accion: "Stop", duracion: null },
  ],
  onSubir,
  onBajar,
  onIzquierda,
  onDerecha,
  onStop,
}) {
  return (
    <>
      <Header></Header>
      <DashboardNavbar/>
      
      <div className="pol-page">
        <div className="pol-topbar">
          <h1 className="pol-title">Control de polipasto</h1>

          <div className={`pol-conexion ${conectado ? "pol-conexion--ok" : "pol-conexion--off"}`}>
            <span className="pol-led pol-led--pulse" />
            {conectado ? "Conectado" : "Desconectado"}
          </div>
        </div>

        <div className="pol-grid-top">
          <EstadoCard
            estado={estado}
            movimiento={movimiento}
            carga={carga}
            altura={altura}
          />

          <ControlPad
            onSubir={onSubir}
            onBajar={onBajar}
            onIzquierda={onIzquierda}
            onDerecha={onDerecha}
            onStop={onStop}
          />
        </div>

        <VelocidadSlider valor={velocidad} onChange={onVelocidadChange} />

        <div className="pol-grid-mid">
          <StatusList title="Límites" items={limites} />
          <StatusList title="Alarmas" items={alarmas} />
        </div>

        <HistorialMovimientos movimientos={historial} />
      </div>
    
    </>
  );
}
