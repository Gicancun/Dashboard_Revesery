// Kartu KPI dengan animasi hitung naik, ikon, dan tren opsional.
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

type Tone = "brand" | "churn" | "retain" | "accent";
const toneMap: Record<Tone, { text: string; bg: string; hoverBorder: string }> = {
  brand: { text: "text-brand-soft", bg: "bg-brand/10 border border-brand/15", hoverBorder: "hover:border-brand/30" },
  churn: { text: "text-churn", bg: "bg-churn/10 border border-churn/15", hoverBorder: "hover:border-churn/30" },
  retain: { text: "text-retain", bg: "bg-retain/10 border border-retain/15", hoverBorder: "hover:border-retain/30" },
  accent: { text: "text-accent", bg: "bg-accent/10 border border-accent/15", hoverBorder: "hover:border-accent/30" },
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`card card-glass p-5 ${t.hoverBorder}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted/80">{label}</span>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${t.bg}`}>
          <Icon className={`h-5 w-5 ${t.text}`} strokeWidth={2.2} />
        </span>
      </div>
      <div className="mt-3 font-display text-2xl font-bold tracking-tight text-fg tabular-nums sm:text-3xl">
        {display}
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted/70">{hint}</p>}
    </motion.div>
  );
}

