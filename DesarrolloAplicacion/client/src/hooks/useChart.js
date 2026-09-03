import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// Creates/updates a Chart.js chart on a canvas and tears it down on unmount
// or when this component re-renders with new data. Replaces the pattern of
// `new Chart(document.getElementById(...))` from the original api.js.
export default function useChart(config) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, config);

    return () => {
      chartRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(config.data), config.type]);

  return canvasRef;
}
