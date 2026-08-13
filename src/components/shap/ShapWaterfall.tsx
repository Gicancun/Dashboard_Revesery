// SHAP Waterfall: menjelaskan SATU prediksi. Dimulai dari base value (E[f(x)]),
// tiap fitur menambah/mengurangi hingga sampai nilai prediksi akhir f(x).
import type { Data } from "plotly.js";
import { PlotlyChart } from "@/components/charts/PlotlyChart";
import type { ShapData } from "@/types";

export function ShapWaterfall({ data, height = 420 }: { data: ShapData["waterfall"]; height?: number }) {
  const sorted = [...data.contributions].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  const labels = ["Base value E[f(x)]", ...sorted.map((c) =>
    c.feature_value !== undefined ? `${c.feature} = ${c.feature_value}` : c.feature,
  ), "Prediksi f(x)"];
  const measures = ["absolute", ...sorted.map(() => "relative"), "total"];
  const values = [data.base_value, ...sorted.map((c) => c.value), 0];

  // Tipe "waterfall" belum sepenuhnya ada di @types/plotly.js, jadi objek trace
  // disusun longgar lalu di-cast ke Data.
  const trace = {
    type: "waterfall",
    orientation: "h",
    y: labels,
    x: values,
    measure: measures,
    connector: { line: { color: "rgba(148,163,184,0.4)" } },
    increasing: { marker: { color: "#ef4444" } }, // menaikkan risiko churn (merah — konvensi SHAP)
    decreasing: { marker: { color: "#0d47a1" } }, // menurunkan risiko churn (--info-dark, senada gelap = sisi baik)
    totals: { marker: { color: "#2196f3" } }, // Base value & Prediksi f(x) — penanda netral (--info)
    hovertemplate: "%{y}<br>%{x:+.3f}<extra></extra>",
  } as unknown as Data;

  return (
    <PlotlyChart
      data={[trace]}
      height={height}
      layout={{ margin: { l: 180, r: 30, t: 10, b: 40 }, yaxis: { automargin: true } }}
    />
  );
}
