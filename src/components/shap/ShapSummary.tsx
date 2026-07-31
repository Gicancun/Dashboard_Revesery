// SHAP Summary Plot (beeswarm). Setiap titik = 1 sampel; posisi X = nilai SHAP,
// warna = nilai fitur (biru rendah → merah tinggi). Fitur diurutkan by |SHAP|.
import { useMemo } from "react";
import type { Data } from "plotly.js";
import { PlotlyChart } from "@/components/charts/PlotlyChart";
import type { ShapData } from "@/types";

export function ShapSummary({ data, height = 460 }: { data: ShapData["summary"]; height?: number }) {
  const traces = useMemo<Data[]>(() => {
    // Urutkan fitur berdasarkan rata-rata |shap| (paling penting di atas).
    const ranked = [...data].sort(
      (a, b) =>
        a.shap_values.reduce((s, v) => s + Math.abs(v), 0) / a.shap_values.length -
        b.shap_values.reduce((s, v) => s + Math.abs(v), 0) / b.shap_values.length,
    );
    return ranked.map((f, idx) => {
      // jitter vertikal agar titik tidak menumpuk
      const y = f.shap_values.map(() => idx + (Math.random() - 0.5) * 0.55);
      return {
        type: "scattergl",
        mode: "markers",
        x: f.shap_values,
        y,
        marker: {
          size: 6,
          color: f.feature_values,
          colorscale: [[0, "#3b82f6"], [1, "#ef4444"]],
          showscale: idx === ranked.length - 1,
          colorbar: idx === ranked.length - 1
            ? { title: "Nilai fitur", thickness: 10, len: 0.5, tickvals: [0, 1], ticktext: ["Rendah", "Tinggi"] }
            : undefined,
          opacity: 0.75,
        },
        name: f.feature,
        hovertemplate: `${f.feature}<br>SHAP: %{x:.3f}<extra></extra>`,
      } as Data;
    });
  }, [data]);

  const tickvals = data.map((_, i) => i);
  const ranked = [...data].sort(
    (a, b) =>
      a.shap_values.reduce((s, v) => s + Math.abs(v), 0) -
      b.shap_values.reduce((s, v) => s + Math.abs(v), 0),
  );

  return (
    <PlotlyChart
      data={traces}
      height={height}
      layout={{
        showlegend: false,
        xaxis: { title: { text: "Nilai SHAP (dampak pada prediksi churn)" }, zeroline: true },
        yaxis: { tickmode: "array", tickvals, ticktext: ranked.map((f) => f.feature), automargin: true },
        margin: { l: 130, r: 20, t: 10, b: 45 },
      }}
    />
  );
}
