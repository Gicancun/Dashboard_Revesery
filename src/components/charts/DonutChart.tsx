// Pie/Donut chart reusable untuk distribusi churn vs aktif.
import { Doughnut, Pie } from "react-chartjs-2";
import { useChartTheme } from "@/hooks/useChartTheme";
import { ChartFrame } from "./ChartFrame";

interface Slice { label: string; count: number; }

export function DonutChart({
  data, variant = "doughnut", height = 280, colors,
}: {
  data: Slice[];
  variant?: "doughnut" | "pie";
  height?: number;
  colors?: string[];
}) {
  const c = useChartTheme();
  const palette = colors ?? [c.churn, c.retain, c.brand, c.accent, c.warn];
  const Comp = variant === "pie" ? Pie : Doughnut;
  return (
    <ChartFrame height={height}>
      <Comp
        data={{
          labels: data.map((d) => d.label),
          datasets: [
            {
              data: data.map((d) => d.count),
              backgroundColor: palette,
              borderColor: c.surface, borderWidth: 3, hoverOffset: 6,
            },
          ],
        }}
        options={{
          responsive: true, maintainAspectRatio: false,
          cutout: variant === "doughnut" ? "62%" : 0,
          plugins: {
            legend: { position: "bottom", labels: { color: c.text, usePointStyle: true, boxWidth: 8, padding: 16 } },
            tooltip: { backgroundColor: c.surface, titleColor: c.fg, bodyColor: c.fg, borderColor: c.grid, borderWidth: 1, padding: 12 },
          },
        }}
      />
    </ChartFrame>
  );
}
