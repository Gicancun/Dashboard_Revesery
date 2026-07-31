// Line chart tren jumlah customer (total vs churn) per periode.
import { Line } from "react-chartjs-2";
import { useChartTheme } from "@/hooks/useChartTheme";
import { ChartFrame } from "./ChartFrame";

interface Point { label: string; total: number; churned: number; }

export function TrendLineChart({ data, height = 300 }: { data: Point[]; height?: number }) {
  const c = useChartTheme();
  return (
    <ChartFrame height={height}>
      <Line
        data={{
          labels: data.map((d) => d.label),
          datasets: [
            {
              label: "Total Customer", data: data.map((d) => d.total),
              borderColor: c.brand, backgroundColor: c.brandFill,
              fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2.5,
            },
            {
              label: "Customer Churn", data: data.map((d) => d.churned),
              borderColor: c.churn, backgroundColor: c.churnFill,
              fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2.5,
            },
          ],
        }}
        options={{
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { labels: { color: c.text, usePointStyle: true, boxWidth: 8, padding: 16 } },
            tooltip: { backgroundColor: c.surface, titleColor: c.fg, bodyColor: c.fg, borderColor: c.grid, borderWidth: 1, padding: 12 },
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: c.text } },
            y: { grid: { color: c.grid }, ticks: { color: c.text }, border: { display: false } },
          },
        }}
      />
    </ChartFrame>
  );
}
