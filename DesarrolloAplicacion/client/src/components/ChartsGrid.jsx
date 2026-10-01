import useChart from "../hooks/useChart";
import { useState } from "react";
import Service from '../services/Service';

function ChartCard({ title, subtitle, config }) {
  const canvasRef = useChart(config);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="chart-container">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

// chartData: {
//   principal: Chart.js config,
//   pulsaciones: Chart.js config,
//   voltajeX: Chart.js config,
//   voltajeY: Chart.js config,
// }
export default function ChartsGrid({ chartData }) {
  const [termino, setTermino] = useState('');
  
  const handleClic = async (telefono) => {
    try {
      const response = await Service.enviarSMS(telefono)
      console.log(response)
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  }
  
  return (
    <section className="section-block">
      <div className="section-header">
        <div>
          <h2>Comportamiento de variables</h2>
          <p>Tendencias obtenidas de los dispositivos seleccionados.</p>
        </div>
        <div>
          <input 
            type="text" 
            placeholder="eje. 5678 9807" 
            value={termino} 
            onChange={(e) => setTermino(e.target.value)}
          />
          <button type="button" className="btn-filter" onClick={() => handleClic(termino)}>Enviar alerta</button>
        </div>
      </div>

      <div className="charts-grid">
        <ChartCard
          title="Fase 1"
          subtitle="Corriente en la fase 1 (A)"
          config={chartData.principal}
        />

        <ChartCard
          title="Fase 2"
          subtitle="Corriente en la fase 2 (A)"
          config={chartData.voltajeX}
        />

        <ChartCard
          title="Fase 3"
          subtitle="Corriente en la fase 3 (A)"
          config={chartData.voltajeY}
        />

        <ChartCard
          title="Pulsaciones"
          subtitle="Eventos registrados"
          config={chartData.pulsaciones}
        />
      </div>
    </section>
  );
}
