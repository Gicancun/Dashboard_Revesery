// Membungkus Plotly dengan lazy import (Plotly berukuran besar) + tema.
// Memakai factory + plotly.js-dist-min agar hanya modul inti yang dimuat.
import { lazy, Suspense, useMemo } from "react";
import type { Data, Layout, Config } from "plotly.js";
import { useTheme } from "@/context/ThemeContext";
import { ChartSkeleton } from "@/components/ui/States";

// react-plotly.js/factory dipasangkan dengan build "dist-min".
const Plot = lazy(async () => {
  const [{ default: createPlotlyComponent }, Plotly] = await Promise.all([
    import("react-plotly.js/factory"),
    import("plotly.js-dist-min"),
  ]);
  return { default: createPlotlyComponent((Plotly as unknown as { default: unknown }).default ?? Plotly) };
});

const cssVar = (name: string) =>
  typeof window === "undefined"
    ? "#000"
    : `rgb(${getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).join(",")})`;

export function PlotlyChart({
  data, layout, height = 380,
}: {
  data: Data[];
  layout?: Partial<Layout>;
  height?: number;
}) {
  const { theme } = useTheme();
  const themedLayout: Partial<Layout> = useMemo(() => {
    const font = cssVar("--muted");
    const grid = cssVar("--border");
    return {
      autosize: true,
      height,
      margin: { l: 60, r: 20, t: 20, b: 45 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { family: "Inter, sans-serif", color: font, size: 12 },
      xaxis: { gridcolor: grid, zerolinecolor: grid, ...layout?.xaxis },
      yaxis: { gridcolor: grid, zerolinecolor: grid, ...layout?.yaxis },
      legend: { orientation: "h", y: -0.2 },
      ...layout,
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
    // theme sengaja jadi dependency untuk re-render warna
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, height, layout]);

  const config: Partial<Config> = { displayModeBar: false, responsive: true };

  return (
    <Suspense fallback={<ChartSkeleton height={height} />}>
      <Plot
        data={data}
        layout={themedLayout}
        config={config}
        useResizeHandler
        style={{ width: "100%", height }}
      />
    </Suspense>
  );
}
