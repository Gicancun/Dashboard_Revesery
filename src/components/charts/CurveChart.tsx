// Chart kurva generik (ROC, Precision-Recall, Learning Curve).
import { Line } from "react-chartjs-2";
import { useChartTheme } from "@/hooks/useChartTheme";
import { ChartFrame } from "./ChartFrame";

export interface CurveSeries {
  label: string;
  x: number[];
  y: number[];
  color: string;
  dashed?: boolean;
}

export function CurveChart({
  series, xLabel, yLabel, height = 320, diagonal = false,
}: {
  series: CurveSeries[];
  xLabel: string;
  yLabel: string;
  height?: number;
  diagonal?: boolean; // garis acak 45° untuk ROC
}) {
  const c = useChartTheme();
  const datasets = series.map((s) => ({
    label: s.label,
    data: s.x.map((xv, i) => ({ x: xv, y: s.y[i] })),
    borderColor: s.color,
    backgroundColor: s.color,
    borderDash: s.dashed ? [6, 6] : [],
    fill: false, tension: 0.25, pointRadius: 0, borderWidth: 2.5,
  }));
  if (diagonal) {
    datasets.push({
      label: "Random (AUC 0.5)",
      data: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      borderColor: c.text, backgroundColor: c.text,
      borderDash: [4, 4], fill: false, tension: 0, pointRadius: 0, borderWidth: 1.5,
    });
  }
  return (
    <ChartFrame height={height}>
      <Line
        data={{ datasets }}
        options={{
          responsive: true, maintainAspectRatio: false,
          parsing: false as const,
          plugins: {
            legend: { labels: { color: c.text, usePointStyle: true, boxWidth: 8, padding: 14 } },
            tooltip: { backgroundColor: c.surface, titleColor: c.fg, bodyColor: c.fg, borderColor: c.grid, borderWidth: 1, padding: 10 },
          },
          scales: {
            x: {
              type: "linear", min: 0, max: 1, title: { display: true, text: xLabel, color: c.text },
              grid: { color: c.grid }, ticks: { color: c.text }, border: { display: false },
            },
            y: {
              min: 0, max: 1.02, title: { display: true, text: yLabel, color: c.text },
              grid: { color: c.grid }, ticks: { color: c.text }, border: { display: false },
            },
          },
        }}
      />
    </ChartFrame>
  );
}
