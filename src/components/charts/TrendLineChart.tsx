// Line chart tren jumlah customer (total vs churn) per periode.
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend,
} from "chart.js";
import { ChartFrame } from "./ChartFrame";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Point { label: string; total: number; churned: number; }

export function TrendLineChart({ data, height = 300 }: { data: Point[]; height?: number }) {
  const BRAND   = "rgba(139, 92, 246, 1)";    // violet-500
  const BRAND_F = "rgba(139, 92, 246, 0.18)";
  const CHURN   = "rgba(248, 113, 113, 1)";    // red-400
  const CHURN_F = "rgba(248, 113, 113, 0.18)";
  const GRID    = "rgba(139, 92, 246, 0.12)";
  const TEXT    = "rgba(139, 92, 246, 0.9)";
  const SURF    = "#0e0a23";
  const FG      = "#ede9fe";

  return (
    <ChartFrame height={height}>
      <Line
        data={{
          labels: data.map((d) => d.label),
          datasets: [
            {
              label: "Total Customer",
              data: data.map((d) => d.total),
              borderColor: BRAND,
              backgroundColor: BRAND_F,
              fill: true,
              tension: 0.45,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: BRAND,
              pointHoverBorderColor: "#fff",
              pointHoverBorderWidth: 2,
              borderWidth: 2.5,
            },
            {
              label: "Customer Churn",
              data: data.map((d) => d.churned),
              borderColor: CHURN,
              backgroundColor: CHURN_F,
              fill: true,
              tension: 0.45,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: CHURN,
              pointHoverBorderColor: "#fff",
              pointHoverBorderWidth: 2,
              borderWidth: 2.5,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: {
              labels: {
                color: TEXT,
                usePointStyle: true,
                pointStyle: "circle",
                boxWidth: 8,
                padding: 18,
                font: { size: 12, weight: 500 },
              },
            },
            tooltip: {
              backgroundColor: SURF,
              titleColor: FG,
              bodyColor: FG,
              borderColor: "rgba(139,92,246,0.3)",
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: (ctx) =>
                  ` ${ctx.dataset.label}: ${(ctx.parsed?.y ?? 0).toLocaleString("id-ID")} pelanggan`,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                color: TEXT,
                font: { size: 11 },
                maxTicksLimit: 8,
              },
              border: { display: false },
            },
            y: {
              grid: { color: GRID },
              ticks: {
                color: TEXT,
                font: { size: 11 },
                callback: (v) => Number(v).toLocaleString("id-ID"),
              },
              border: { display: false },
            },
          },
        }}
      />
    </ChartFrame>
  );
}
