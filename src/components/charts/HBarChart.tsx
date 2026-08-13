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
  // Canvas tidak bisa resolve var() dari CSS sendiri — kalau caller kirim string
  // "rgb(var(--x))" literal, ambil nilai sudah-jadi dari token theme yang sama.
  const TOKEN_MAP: Record<string, string> = {
    "--churn": c.churn, "--retain": c.retain, "--brand": c.brand, "--info": c.info, "--accent": c.accent, "--warn": c.warn,
  };
  const resolveColor = (v: string): string => {
    const match = v.match(/--[\w-]+/);
    return match && TOKEN_MAP[match[0]] ? TOKEN_MAP[match[0]] : v;
  };
  const bg = diverging
    ? items.map((i) => (i.value >= 0 ? c.churn : c.retain))
    : resolveColor(color ?? c.info);
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
