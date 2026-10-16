import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import FormLogin from "./pages/login";

export default function App() {
  return (
    <FormLogin/>
    /*<BrowserRouter>
      <Routes>
        <Route path="/" element={<FormLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dispositivos" element={<Dispositivos />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/simulador" element={<Simulador />} />
      </Routes>
    </BrowserRouter>*/
  );
}
