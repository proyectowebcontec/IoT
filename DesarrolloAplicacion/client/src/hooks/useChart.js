import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// Creates/updates a Chart.js chart on a canvas and tears it down on unmount
// or when this component re-renders with new data. Replaces the pattern of
// `new Chart(document.getElementById(...))` from the original api.js.
export default function useChart(config) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // Crear al montar, destruir al desmontar
  useEffect(() => {
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: { labels: [], datasets: [] },
      options: {
        animation: false,          // Sin animación: evita el "salto" de toda la línea
        responsive: true,
        maintainAspectRatio: false,
        elements: { point: { radius: 0 } }, // Más ligero con muchos puntos
        interaction: { mode: "index", intersect: false },
      },
    });
    return () => chartRef.current?.destroy();
  }, []);

  // Actualizar datos sin recrear el gráfico
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !config?.data) return;

    chart.data.labels = config.data.labels;

    config.data.datasets.forEach((nuevo, i) => {
      const actual = chart.data.datasets[i];
      if (actual) {
        actual.label = nuevo.label;
        actual.data = nuevo.data;
      } else {
        chart.data.datasets.push({ ...nuevo });
      }
    });
    chart.data.datasets.length = config.data.datasets.length;

    chart.update("none");
  }, [config]);

  return canvasRef;
}
