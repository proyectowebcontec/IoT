import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Dashboard from "./pages/Dashboard";
// import Dispositivos from "./pages/Dispositivos";
// import Historial from "./pages/Historial";
import Simulador from "./pages/PolipastoControl";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/dispositivos" element={<Dispositivos />} /> */}
        {/* <Route path="/historial" element={<Historial />} /> */}
        <Route path="/simulador" element={<Simulador />} />
      </Routes>
    </BrowserRouter>
  );
}
