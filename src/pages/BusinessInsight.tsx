// Halaman Business Insight: menerjemahkan hasil SHAP menjadi temuan bisnis.
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Crown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useJsonData } from "@/hooks/useJsonData";
import { DataBoundary } from "@/components/ui/DataBoundary";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/States";
import { HBarChart } from "@/components/charts/HBarChart";
import type { InsightData } from "@/types";

export default function BusinessInsight() {
  const state = useJsonData<InsightData>("insight.json");
  return (
    <>
      <SectionHeading
        eyebrow="Bisnis"
        title="Business Insight"
        description="Temuan otomatis dari analisis SHAP: faktor-faktor yang paling memengaruhi keputusan pelanggan untuk churn di Revesery Store."
      />
      <DataBoundary state={state} skeleton={<div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-96" /></div>}>
        {(d) => {
          const top10 = d.top_factors.slice(0, 10);
          const increasing = d.top_factors.filter((f) => f.direction === "increase");
          const decreasing = d.top_factors.filter((f) => f.direction === "decrease");
          return (
            <div className="space-y-6">
              {/* Faktor dominan */}
              <Card delay={0} className="border-brand/30 bg-gradient-to-br from-brand/[0.06] to-transparent">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand text-brand-fg"><Crown className="h-6 w-6" /></span>
                  <div>
                    <span className="chip bg-brand/10 text-brand">Faktor Paling Dominan</span>
                    <h3 className="mt-2 font-display text-xl font-bold text-fg">{d.dominant_factor.feature}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-muted">{d.dominant_factor.description}</p>
                  </div>
                </div>
              </Card>

              {/* Ranking top 10 */}
              <Card delay={0.05}>
                <CardHeader title="Top 10 Faktor Penyebab Churn" subtitle="Diurutkan berdasarkan besar pengaruh (|SHAP|)" />
                <HBarChart items={top10.map((f) => ({ name: f.feature, value: f.impact }))} color="rgb(var(--brand))" />
              </Card>

              {/* Increase vs decrease */}
              <div className="grid gap-4 lg:grid-cols-2">
                <Card delay={0.05}>
                  <CardHeader title="Meningkatkan Risiko Churn" subtitle="Faktor yang mendorong pelanggan pergi"
                    right={<span className="chip bg-churn/10 text-churn"><TrendingUp className="h-3.5 w-3.5" /> {increasing.length} faktor</span>} />
                  <div className="space-y-2.5">
                    {increasing.map((f, i) => (
                      <motion.div key={f.feature} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 rounded-xl border border-border bg-surface-2/40 p-3">
                        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-churn" />
                        <div>
                          <div className="text-sm font-semibold text-fg">{f.feature}</div>
                          <div className="text-xs text-muted">{f.description}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                <Card delay={0.1}>
                  <CardHeader title="Menurunkan Risiko Churn" subtitle="Faktor yang membuat pelanggan bertahan"
                    right={<span className="chip bg-retain/10 text-retain"><TrendingDown className="h-3.5 w-3.5" /> {decreasing.length} faktor</span>} />
                  <div className="space-y-2.5">
                    {decreasing.map((f, i) => (
                      <motion.div key={f.feature} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 rounded-xl border border-border bg-surface-2/40 p-3">
                        <ArrowDownRight className="mt-0.5 h-4 w-4 shrink-0 text-retain" />
                        <div>
                          <div className="text-sm font-semibold text-fg">{f.feature}</div>
                          <div className="text-xs text-muted">{f.description}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Narasi akademik */}
              <Card delay={0.1}>
                <CardHeader title="Narasi Akademik" subtitle="Interpretasi menyeluruh hasil analisis" />
                <div className="space-y-3 text-sm leading-relaxed text-muted">
                  {d.narrative.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </Card>
            </div>
          );
        }}
      </DataBoundary>
    </>
  );
}
