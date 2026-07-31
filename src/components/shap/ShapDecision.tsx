// SHAP Decision Plot: menunjukkan jalur akumulasi kontribusi fitur untuk
// beberapa sampel, dari base value hingga prediksi akhir.
import type { Data } from "plotly.js";
import { PlotlyChart } from "@/components/charts/PlotlyChart";
import type { ShapData } from "@/types";

export function ShapDecision({ data, height = 440 }: { data: NonNullable<ShapData["decision"]>; height?: number }) {
  const y = data.features;
  const palette = ["#4F46E5", "#ef4444", "#10b981", "#0ea5e9", "#f59e0b"];
  const traces: Data[] = data.paths.map((p, i) => ({
    type: "scatter",
    mode: "lines+markers",
    x: p.cumulative,
    y,
    name: p.label,
    line: { color: palette[i % palette.length], width: 2 },
    marker: { size: 6 },
  }));
  return (
    <PlotlyChart
      data={traces}
      height={height}
      layout={{
        xaxis: { title: { text: "Akumulasi nilai model (menuju prediksi churn)" } },
        yaxis: { automargin: true },
        margin: { l: 140, r: 20, t: 10, b: 45 },
        shapes: [{ type: "line", x0: data.base_value, x1: data.base_value, y0: -0.5, y1: y.length - 0.5, line: { dash: "dot", color: "rgba(148,163,184,0.7)" } }],
      }}
    />
  );
}
