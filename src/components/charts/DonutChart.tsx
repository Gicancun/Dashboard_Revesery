// Pie/Donut chart reusable untuk distribusi churn vs aktif.
import { Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
} from "chart.js";
import { ChartFrame } from "./ChartFrame";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Slice { label: string; count: number; }

// Palette default — explicit hex agar Chart.js bisa parse langsung
const DEFAULT_PALETTE = [
  "#f87171", // red-400  (churn)
  "#34d399", // emerald-400 (retain)
  "#8b5cf6", // violet-500 (brand)
  "#22d3ee", // cyan-400 (accent)
  "#fbbf24", // amber-400 (warn)
];

const SURF = "#0e0a23";
const FG   = "#ede9fe";
const GRID = "rgba(139, 92, 246, 0.25)";
const TEXT = "rgba(167, 139, 250, 0.9)";

export function DonutChart({
  data,
  variant = "doughnut",
  height = 280,
  colors,
}: {
  data: Slice[];
  variant?: "doughnut" | "pie";
  height?: number;
  colors?: string[];
}) {
  // Konversi warna CSS var jika perlu — gunakan hardcoded hex saat tidak ada warna eksplisit
  const resolveColor = (c: string): string => {
    if (c.startsWith("rgb(var(")) {
      // mapping CSS variable ke hex statis
      if (c.includes("--churn"))  return "#f87171";
      if (c.includes("--retain")) return "#34d399";
      if (c.includes("--brand"))  return "#8b5cf6";
      if (c.includes("--accent")) return "#22d3ee";
      if (c.includes("--warn"))   return "#fbbf24";
    }
    return c;
  };

  const palette = (colors ?? DEFAULT_PALETTE).map(resolveColor);
  const Comp = variant === "pie" ? Pie : Doughnut;

  return (
    <ChartFrame height={height}>
      <Comp
        data={{
          labels: data.map((d) => d.label),
          datasets: [
            {
              data: data.map((d) => d.count),
              backgroundColor: palette.slice(0, data.length),
              borderColor: SURF,
              borderWidth: 3,
              hoverOffset: 8,
              hoverBorderColor: "#fff",
              hoverBorderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: variant === "doughnut" ? "62%" : 0,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: TEXT,
                usePointStyle: true,
                pointStyle: "circle",
                boxWidth: 9,
                padding: 18,
                font: { size: 12, weight: 500 },
              },
            },
            tooltip: {
              backgroundColor: SURF,
              titleColor: FG,
              bodyColor: FG,
              borderColor: GRID,
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: (ctx) => {
                  const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
                  const value = ctx.parsed;
                  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
                  return ` ${ctx.label}: ${value.toLocaleString("id-ID")} (${pct}%)`;
                },
              },
            },
          },
        }}
      />
    </ChartFrame>
  );
}
