import { Bar } from "react-chartjs-2";
import { useChartTheme } from "@/hooks/useChartTheme";
import { ChartFrame } from "./ChartFrame";
import type { CategoricalDist } from "@/types";

export function CategoricalBar({ data, height = 280 }: { data: CategoricalDist; height?: number }) {
  const c = useChartTheme();
  return (
    <ChartFrame height={height}>
      <Bar
        data={{
          labels: data.categories,
          datasets: [
            { label: "Bertahan", data: data.retain, backgroundColor: c.retain, borderRadius: 5, stack: "s" },
            { label: "Churn", data: data.churn, backgroundColor: c.churn, borderRadius: 5, stack: "s" },
          ],
        }}
        options={{
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: c.text, usePointStyle: true, boxWidth: 8, padding: 12 } },
            tooltip: { backgroundColor: c.surface, titleColor: c.fg, bodyColor: c.fg, borderColor: c.grid, borderWidth: 1 },
          },
          scales: {
            x: { stacked: true, grid: { display: false }, ticks: { color: c.text } },
            y: { stacked: true, grid: { color: c.grid }, ticks: { color: c.text }, border: { display: false } },
          },
        }}
      />
    </ChartFrame>
  );
}
