// Confusion matrix 2x2 dengan intensitas warna proporsional.
import { motion } from "framer-motion";

export function ConfusionMatrix({
  matrix, labels = ["Tidak Churn", "Churn"],
}: {
  matrix: number[][];
  labels?: string[];
}) {
  const max = Math.max(...matrix.flat(), 1);
  const cellMeta = [
    ["TN", "Benar: pelanggan bertahan"],
    ["FP", "Salah alarm churn"],
    ["FN", "Churn tak terdeteksi"],
    ["TP", "Benar: churn terdeteksi"],
  ];
  return (
    <div>
      <div className="grid grid-cols-[auto_1fr_1fr] gap-2 text-sm">
        <div />
        <div className="pb-1 text-center text-xs font-medium text-muted">Prediksi: {labels[0]}</div>
        <div className="pb-1 text-center text-xs font-medium text-muted">Prediksi: {labels[1]}</div>
        {matrix.map((row, i) =>
          [
            <div key={`lbl-${i}`} className="flex items-center justify-end pr-2 text-right text-xs font-medium text-muted">
              Aktual:<br />{labels[i]}
            </div>,
            ...row.map((val, j) => {
              const idx = i * 2 + j;
              const isDiag = i === j;
              const intensity = val / max;
              return (
                <motion.div
                  key={`cell-${i}-${j}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.06 }}
                  className="relative grid aspect-[2/1] place-items-center rounded-xl border border-border"
                  style={{
                    background: isDiag
                      ? `rgb(var(--info-dark) / ${0.12 + intensity * 0.5})`
                      : `rgb(var(--info) / ${0.1 + intensity * 0.45})`,
                  }}
                >
                  <div className="text-center">
                    <div className="font-display text-2xl font-bold text-fg tabular-nums">{val.toLocaleString("id-ID")}</div>
                    <div className="text-[11px] font-medium text-muted">{cellMeta[idx][0]}</div>
                  </div>
                </motion.div>
              );
            }),
          ],
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-muted sm:grid-cols-4">
        {cellMeta.map(([k, d]) => (
          <div key={k}><span className="font-semibold text-fg">{k}</span> · {d}</div>
        ))}
      </div>
    </div>
  );
}
