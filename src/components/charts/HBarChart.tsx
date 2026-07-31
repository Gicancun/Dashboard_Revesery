// Horizontal bar chart reusable (feature importance, SHAP bar plot).
import { Bar } from "react-chartjs-2";
import { useChartTheme } from "@/hooks/useChartTheme";
import { ChartFrame } from "./ChartFrame";

interface Item { name: string; value: number; }

export function HBarChart({
  items, height, color, diverging = false,
}: {
  items: Item[];
  height?: number;
  color?: string;
  diverging?: boolean; // warnai positif/negatif berbeda
}) {
  const c = useChartTheme();
  const h = height ?? Math.max(220, items.length * 34 + 40);
  const bg = diverging
    ? items.map((i) => (i.value >= 0 ? c.churn : c.retain))
    : color ?? c.brand;
  return (
    <ChartFrame height={h}>
      <Bar
        data={{
          labels: items.map((i) => i.name),
          datasets: [{ data: items.map((i) => i.value), backgroundColor: bg, borderRadius: 6, barThickness: 18 }],
        }}
        options={{
          indexAxis: "y", responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: c.surface, titleColor: c.fg, bodyColor: c.fg, borderColor: c.grid, borderWidth: 1, padding: 10 },
          },
          scales: {
            x: { grid: { color: c.grid }, ticks: { color: c.text }, border: { display: false } },
            y: { grid: { display: false }, ticks: { color: c.fg, font: { size: 12 } } },
          },
        }}
      />
    </ChartFrame>
  );
}
