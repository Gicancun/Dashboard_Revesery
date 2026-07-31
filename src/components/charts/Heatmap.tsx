// Heatmap korelasi kustom. Warna: biru(negatif) → netral → merah(positif).
import type { Heatmap as HeatmapType } from "@/types";

function corrColor(v: number): string {
  // v: -1..1
  if (v >= 0) return `rgb(var(--churn) / ${0.12 + v * 0.75})`;
  return `rgb(var(--accent) / ${0.12 + Math.abs(v) * 0.75})`;
}

export function Heatmap({ data }: { data: HeatmapType }) {
  const { labels, matrix } = data;
  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="grid" style={{ gridTemplateColumns: `120px repeat(${labels.length}, minmax(38px, 1fr))` }}>
          <div />
          {labels.map((l) => (
            <div key={`h-${l}`} className="truncate px-1 pb-2 text-center text-[10px] font-medium text-muted" title={l}>
              {l}
            </div>
          ))}
          {matrix.map((row, i) => (
            <div key={`r-${i}`} className="contents">
              <div className="flex items-center justify-end pr-2 text-[11px] font-medium text-muted" title={labels[i]}>
                <span className="truncate">{labels[i]}</span>
              </div>
              {row.map((v, j) => (
                <div
                  key={`c-${i}-${j}`}
                  className="grid aspect-square place-items-center border border-surface text-[10px] font-medium tabular-nums"
                  style={{ background: corrColor(v), color: Math.abs(v) > 0.55 ? "white" : "rgb(var(--fg))" }}
                  title={`${labels[i]} × ${labels[j]}: ${v.toFixed(2)}`}
                >
                  {v.toFixed(2)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
