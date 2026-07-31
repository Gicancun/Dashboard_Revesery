// Halaman Strategi Retensi: rekomendasi bisnis berbasis temuan analisis,
// ditampilkan sebagai kartu modern dan dipetakan ke faktor SHAP terkait.
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useJsonData } from "@/hooks/useJsonData";
import { DataBoundary } from "@/components/ui/DataBoundary";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/States";
import { Badge } from "@/components/ui/Badge";
import { pct } from "@/utils/format";
import type { RetentionData, RetentionStrategy } from "@/types";

// Ambil ikon lucide berdasarkan nama string dari JSON (fallback: Sparkles).
function DynamicIcon({ name }: { name: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Sparkles;
  return <Icon className="h-5 w-5" />;
}

const priorityTone: Record<RetentionStrategy["priority"], "churn" | "warn" | "retain"> = {
  Tinggi: "churn", Sedang: "warn", Rendah: "retain",
};

function StrategyCard({ s, i }: { s: RetentionStrategy; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="card flex flex-col p-5 transition-shadow hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand"><DynamicIcon name={s.icon} /></span>
        <Badge tone={priorityTone[s.priority]}>Prioritas {s.priority}</Badge>
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-fg">{s.title}</h3>
      <p className="mt-1.5 flex-1 text-sm text-muted">{s.description}</p>

      <div className="mt-4 space-y-2 border-t border-border pt-3">
        <div className="flex items-center gap-2 text-xs">
          <Icons.Users className="h-3.5 w-3.5 text-muted" />
          <span className="text-muted">Target:</span> <span className="font-medium text-fg">{s.target_segment}</span>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <Icons.Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
          <div className="flex flex-wrap gap-1">
            {s.linked_factors.map((f) => <span key={f} className="chip bg-surface-2 text-muted">{f}</span>)}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Icons.Target className="h-3.5 w-3.5 text-retain" />
          <span className="text-muted">Dampak diharapkan:</span> <span className="font-medium text-retain">{s.expected_impact}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Retention() {
  const state = useJsonData<RetentionData>("retention.json");
  return (
    <>
      <SectionHeading
        eyebrow="Bisnis"
        title="Strategi Retensi Pelanggan"
        description="Rekomendasi tindakan yang dapat diterapkan Revesery Store untuk menekan churn, disusun dari faktor-faktor paling berpengaruh pada model."
      />
      <DataBoundary state={state} skeleton={<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56" />)}</div>}>
        {(d) => (
          <div className="space-y-6">
            {d.segments && d.segments.length > 0 && (
              <Card delay={0}>
                <CardHeader title="Segmentasi Pelanggan" subtitle="Kelompok pelanggan berdasarkan tingkat risiko churn" />
                <div className="grid gap-3 sm:grid-cols-3">
                  {d.segments.map((seg) => (
                    <div key={seg.name} className="rounded-xl border border-border bg-surface-2/40 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-fg">{seg.name}</span>
                        <Badge tone={seg.churn_risk > 0.5 ? "churn" : seg.churn_risk > 0.25 ? "warn" : "retain"}>{pct(seg.churn_risk, 0)} risiko</Badge>
                      </div>
                      <div className="mt-2 font-display text-2xl font-bold text-fg tabular-nums">{seg.size.toLocaleString("id-ID")}</div>
                      <div className="text-xs text-muted">pelanggan</div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                        <div className="h-full rounded-full bg-churn" style={{ width: `${seg.churn_risk * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <div>
              <h2 className="mb-3 font-display text-lg font-semibold text-fg">Rekomendasi Program</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {d.strategies.map((s, i) => <StrategyCard key={s.id} s={s} i={i} />)}
              </div>
            </div>
          </div>
        )}
      </DataBoundary>
    </>
  );
}
