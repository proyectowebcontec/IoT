import useChart from "../hooks/useChart";

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
  return (
    <section className="section-block">
      <div className="section-header">
        <div>
          <h2>Comportamiento de variables</h2>
          <p>Tendencias obtenidas de los dispositivos seleccionados.</p>
        </div>
      </div>

      <div className="charts-grid">
        <ChartCard
          title="Variable principal"
          subtitle="Comportamiento histórico"
          config={chartData.principal}
        />

        <ChartCard
          title="Pulsaciones"
          subtitle="Eventos registrados"
          config={chartData.pulsaciones}
        />

        <ChartCard
          title="Voltaje X"
          subtitle="Lecturas de entrada analógica"
          config={chartData.voltajeX}
        />

        <ChartCard
          title="Voltaje Y"
          subtitle="Lecturas de entrada analógica"
          config={chartData.voltajeY}
        />
      </div>
    </section>
  );
}
