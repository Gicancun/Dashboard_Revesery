// Pie/Donut chart reusable untuk distribusi churn vs aktif.
import { Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
} from "chart.js";
import { ChartFrame } from "./ChartFrame";
import { useChartTheme } from "@/hooks/useChartTheme";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Slice { label: string; count: number; }

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
  const t = useChartTheme();
  const SURF = t.surface;
  const FG   = t.fg;
  const GRID = t.grid;
  const TEXT = t.text;

  // Sama seperti chart lain (HBarChart, CategoricalBar, dll): satu sumber warna,
  // token useChartTheme(), supaya semua visualisasi selalu selaras & ikut tema.
  const TOKEN_MAP: Record<string, string> = {
    "--churn": t.churn, "--retain": t.retain, "--brand": t.brand, "--info": t.info, "--info-dark": t.infoDark, "--accent": t.accent, "--warn": t.warn,
  };
  const DEFAULT_PALETTE = [t.churn, t.retain, t.info, t.accent, t.warn];

  // Kalau caller kirim string CSS var (mis. "rgb(var(--churn))"), Canvas tidak bisa
  // meresolve var() itu sendiri — ambil nilai sudah-jadi dari token map di atas.
  const resolveColor = (c: string): string => {
    const match = c.match(/--[\w-]+/);
    if (match && TOKEN_MAP[match[0]]) return TOKEN_MAP[match[0]];
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
