// Kartu KPI dengan animasi hitung naik, ikon, dan tren opsional.
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

type Tone = "brand" | "churn" | "retain" | "accent";
const toneMap: Record<Tone, { text: string; bg: string }> = {
  brand: { text: "text-brand", bg: "bg-brand/10" },
  churn: { text: "text-churn", bg: "bg-churn/10" },
  retain: { text: "text-retain", bg: "bg-retain/10" },
  accent: { text: "text-accent", bg: "bg-accent/10" },
};

interface KpiCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: Tone;
  /** Fungsi format nilai akhir (mis. persen atau skor). */
  format?: (v: number) => string;
  hint?: string;
  delay?: number;
}

export function KpiCard({
  label, value, icon: Icon, tone = "brand", format, hint, delay = 0,
}: KpiCardProps) {
  const animated = useCountUp(value);
  const t = toneMap[tone];
  const display = format ? format(animated) : Math.round(animated).toLocaleString("id-ID");

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="card p-5 transition-shadow hover:shadow-card-hover"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        <span className={`grid h-9 w-9 place-items-center rounded-lg ${t.bg}`}>
          <Icon className={`h-4.5 w-4.5 ${t.text}`} strokeWidth={2.2} />
        </span>
      </div>
      <div className="mt-3 font-display text-2xl font-bold tracking-tight text-fg tabular-nums">
        {display}
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </motion.div>
  );
}
