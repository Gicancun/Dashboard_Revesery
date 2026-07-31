// Representasi SHAP Force Plot: kekuatan yang "mendorong" prediksi ke atas
// (merah, menaikkan churn) atau ke bawah (biru, menurunkan) dari base value.
import { motion } from "framer-motion";
import type { ShapData } from "@/types";
import { score } from "@/utils/format";

export function ShapForce({ data }: { data: NonNullable<ShapData["force"]> }) {
  const feats = [...data.features].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  const total = feats.reduce((s, f) => s + Math.abs(f.value), 0) || 1;
  const pos = feats.filter((f) => f.value > 0);
  const neg = feats.filter((f) => f.value < 0);

  const Bar = ({ items, color }: { items: typeof feats; color: string }) => (
    <div className="flex h-9 overflow-hidden rounded-md">
      {items.map((f, i) => (
        <motion.div
          key={f.feature}
          initial={{ width: 0 }}
          animate={{ width: `${(Math.abs(f.value) / total) * 100}%` }}
          transition={{ delay: i * 0.05, duration: 0.5 }}
          className="group relative flex items-center justify-center border-r border-white/20 text-[10px] font-medium text-white"
          style={{ background: color, minWidth: 2 }}
          title={`${f.feature}${f.feature_value !== undefined ? ` = ${f.feature_value}` : ""}: ${f.value.toFixed(3)}`}
        >
          <span className="truncate px-1">{f.feature}</span>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <span>Base value: <span className="font-mono text-fg">{score(data.base_value)}</span></span>
        <span>Prediksi f(x): <span className="font-mono text-fg">{score(data.prediction)}</span></span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div className="text-right"><Bar items={neg} color="rgb(var(--accent))" /></div>
        <div><Bar items={pos} color="rgb(var(--churn))" /></div>
      </div>
      <div className="mt-2 flex justify-between text-[11px]">
        <span className="text-accent">← Menurunkan risiko churn</span>
        <span className="text-churn">Menaikkan risiko churn →</span>
      </div>
    </div>
  );
}
