// Boxplot ringan berbasis SVG (Chart.js tidak menyediakan boxplot bawaan).
import type { BoxplotData } from "@/types";

export function Boxplot({ data, height = 280 }: { data: BoxplotData; height?: number }) {
  const all = data.groups.flatMap((g) => [g.min, g.max]);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const range = hi - lo || 1;
  const pad = 40;
  const w = 520;
  const x = (v: number) => pad + ((v - lo) / range) * (w - pad * 2);
  const rowH = 54;
  const colors = ["var(--retain)", "var(--churn)", "var(--brand)", "var(--accent)"];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${data.groups.length * rowH + 30}`} className="w-full" style={{ minWidth: 420, height }}>
        {data.groups.map((g, i) => {
          const cy = 24 + i * rowH + rowH / 2;
          const col = `rgb(${colors[i % colors.length]})`;
          return (
            <g key={g.label}>
              <text x={4} y={cy - 14} className="fill-[rgb(var(--muted))] text-[11px]">{g.label}</text>
              <line x1={x(g.min)} y1={cy} x2={x(g.max)} y2={cy} stroke="rgb(var(--muted))" strokeWidth={1.5} />
              <line x1={x(g.min)} y1={cy - 8} x2={x(g.min)} y2={cy + 8} stroke="rgb(var(--muted))" strokeWidth={1.5} />
              <line x1={x(g.max)} y1={cy - 8} x2={x(g.max)} y2={cy + 8} stroke="rgb(var(--muted))" strokeWidth={1.5} />
              <rect x={x(g.q1)} y={cy - 12} width={Math.max(1, x(g.q3) - x(g.q1))} height={24} rx={4}
                fill={col} fillOpacity={0.22} stroke={col} strokeWidth={1.5} />
              <line x1={x(g.median)} y1={cy - 12} x2={x(g.median)} y2={cy + 12} stroke={col} strokeWidth={2.5} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
