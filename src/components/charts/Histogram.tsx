import { Bar } from "react-chartjs-2";
import { useChartTheme } from "@/hooks/useChartTheme";
import { ChartFrame } from "./ChartFrame";
import type { HistogramData } from "@/types";

export function Histogram({ data, height = 280 }: { data: HistogramData; height?: number }) {
  const c = useChartTheme();
  const datasets = data.by_class
    ? [
        { label: "Bertahan", data: data.by_class.retain, backgroundColor: c.retain, borderRadius: 4, stack: "s" },
        { label: "Churn", data: data.by_class.churn, backgroundColor: c.churn, borderRadius: 4, stack: "s" },
      ]
    : [{ label: data.feature, data: data.counts, backgroundColor: c.brand, borderRadius: 4 }];
  return (
    <ChartFrame height={height}>
      <Bar
        data={{ labels: data.bins, datasets }}
        options={{
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: !!data.by_class, labels: { color: c.text, usePointStyle: true, boxWidth: 8, padding: 12 } },
            tooltip: { backgroundColor: c.surface, titleColor: c.fg, bodyColor: c.fg, borderColor: c.grid, borderWidth: 1 },
          },
          scales: {
            x: { stacked: !!data.by_class, grid: { display: false }, ticks: { color: c.text } },
            y: { stacked: !!data.by_class, grid: { color: c.grid }, ticks: { color: c.text }, border: { display: false } },
          },
        }}
      />
    </ChartFrame>
  );
}
