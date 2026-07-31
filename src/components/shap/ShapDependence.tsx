// SHAP Dependence Plot: hubungan nilai satu fitur (X) dengan nilai SHAP-nya (Y),
// diwarnai oleh fitur interaksi. Menunjukkan efek non-linear & interaksi.
import type { Data } from "plotly.js";
import { PlotlyChart } from "@/components/charts/PlotlyChart";
import type { ShapData } from "@/types";

export function ShapDependence({ data, height = 400 }: { data: NonNullable<ShapData["dependence"]>; height?: number }) {
  const trace: Data = {
    type: "scattergl",
    mode: "markers",
    x: data.x,
    y: data.shap,
    marker: {
      size: 7,
      color: data.color ?? data.x,
      colorscale: [[0, "#3b82f6"], [1, "#ef4444"]],
      showscale: true,
      colorbar: { title: data.color_feature ?? "", thickness: 10 },
      opacity: 0.8,
    },
    hovertemplate: `${data.feature}: %{x}<br>SHAP: %{y:.3f}<extra></extra>`,
  } as Data;
  return (
    <PlotlyChart
      data={[trace]}
      height={height}
      layout={{
        xaxis: { title: { text: data.feature } },
        yaxis: { title: { text: `Nilai SHAP untuk ${data.feature}` } },
      }}
    />
  );
}
