// Halaman Dashboard: ringkasan penelitian — Hero banner + KPI utama + tren + komposisi churn.
import { Users, UserMinus, Activity, Target, Crosshair, Radar, Gauge, TrendingDown, Sparkles, ArrowUpRight } from "lucide-react";
import { useApiData } from "@/hooks/useJsonData";
import { DataBoundary } from "@/components/ui/DataBoundary";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/States";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { pct, score } from "@/utils/format";
import type { Metrics } from "@/types";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-44 w-full" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-80 lg:col-span-2" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const state = useApiData<Metrics>("metrics");

  return (
    <>
      <SectionHeading
        eyebrow="Intelligence Dashboard"
        title="Analisis Customer Churn Revesery Store"
        description="Dashboard interaktif berbasis Machine Learning (Random Forest) & Explainable AI (SHAP) untuk identifikasi dini risiko churn pelanggan."
      />

      <DataBoundary state={state} skeleton={<DashboardSkeleton />}>
        {(m) => (
          <div className="space-y-6">
            {/* Hero Summary Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <span className="chip bg-brand/10 text-brand border border-brand/20 mb-3 inline-flex">
                    <Sparkles className="h-3.5 w-3.5" /> Model Performance Overview
                  </span>
                  <h2 className="font-display text-2xl font-extrabold text-fg sm:text-3xl">
                    Performa Model Random Forest: <span className="text-gradient">ROC-AUC {score(m.model.roc_auc)}</span>
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                    Dari total <strong className="text-fg">{m.total_customers.toLocaleString("id-ID")}</strong> pelanggan, terdeteksi <strong className="text-churn">{m.churned_customers.toLocaleString("id-ID")}</strong> ({pct(m.churn_rate)}) mengalami churn. Model berhasil memprediksi pelanggan churn dengan F1-Score <strong className="text-brand">{score(m.model.f1_score)}</strong>.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="rounded-2xl border border-border bg-surface-2/60 p-4 text-center">
                    <div className="text-xs font-semibold text-muted uppercase">Recall</div>
                    <div className="font-display text-2xl font-bold text-retain tabular-nums">{score(m.model.recall)}</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface-2/60 p-4 text-center">
                    <div className="text-xs font-semibold text-muted uppercase">Precision</div>
                    <div className="font-display text-2xl font-bold text-accent tabular-nums">{score(m.model.precision)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI utama */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <KpiCard label="Jumlah Customer" value={m.total_customers} icon={Users} tone="brand" delay={0} />
              <KpiCard label="Customer Churn" value={m.churned_customers} icon={UserMinus} tone="churn" delay={0.05} />
              <KpiCard label="Churn Rate" value={m.churn_rate} icon={TrendingDown} tone="churn" format={(v) => pct(v)} delay={0.1} />
              <KpiCard label="Customer Aktif" value={m.active_customers} icon={Activity} tone="retain" delay={0.15} />
              <KpiCard label="Accuracy Model" value={m.model.accuracy} icon={Gauge} tone="accent" format={score} delay={0.2} />
              <KpiCard label="Precision" value={m.model.precision} icon={Crosshair} tone="accent" format={score} delay={0.25} />
              <KpiCard label="Recall" value={m.model.recall} icon={Radar} tone="retain" format={score} delay={0.3} />
              <KpiCard label="F1 · ROC-AUC" value={m.model.f1_score} icon={Target} tone="brand"
                format={(v) => `${score(v)} · ${score(m.model.roc_auc)}`} delay={0.35} hint="F1 Score · ROC-AUC" />
            </div>

            {/* Tren + komposisi */}
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2" delay={0.1}>
                <CardHeader
                  title="Tren Customer"
                  subtitle={`Perkembangan total pelanggan vs churn per bulan (${m.customer_trend.length} periode)`}
                />
                <TrendLineChart data={m.customer_trend} />
                {/* Summary bawah chart */}
                <div className="mt-3 grid grid-cols-2 divide-x divide-border/60">
                  <div className="pr-4 text-center">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted">Puncak Total</div>
                    <div className="mt-1 font-display text-lg font-bold text-brand-soft tabular-nums">
                      {Math.max(...m.customer_trend.map((t) => t.total)).toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div className="pl-4 text-center">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted">Puncak Churn</div>
                    <div className="mt-1 font-display text-lg font-bold text-churn tabular-nums">
                      {Math.max(...m.customer_trend.map((t) => t.churned)).toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Proporsi Churn — pie + stats */}
              <Card delay={0.15}>
                <CardHeader title="Proporsi Churn" subtitle="Distribusi churn vs pelanggan aktif" />
                <DonutChart
                  variant="pie"
                  data={[
                    { label: "Churn", count: m.churned_customers },
                    { label: "Aktif", count: m.active_customers },
                  ]}
                  colors={["#f87171", "#34d399"]}
                  height={200}
                />
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 rounded-xl bg-churn/10 border border-churn/20 px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-churn shrink-0" />
                    <div>
                      <div className="text-[10px] font-semibold text-churn uppercase tracking-wide">Churn</div>
                      <div className="font-display text-base font-bold text-fg tabular-nums">
                        {((m.churned_customers / Math.max(m.total_customers, 1)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-retain/10 border border-retain/20 px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-retain shrink-0" />
                    <div>
                      <div className="text-[10px] font-semibold text-retain uppercase tracking-wide">Aktif</div>
                      <div className="font-display text-base font-bold text-fg tabular-nums">
                        {((m.active_customers / Math.max(m.total_customers, 1)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Aktif vs Churn donut + Model Stats */}
            <div className="grid gap-4 lg:grid-cols-3">
              <Card delay={0.1}>
                <CardHeader title="Aktif vs Churn" subtitle="Komposisi pelanggan saat ini" />
                <DonutChart
                  data={[
                    { label: "Aktif", count: m.active_customers },
                    { label: "Churn", count: m.churned_customers },
                  ]}
                  colors={["#34d399", "#f87171"]}
                  height={200}
                />
                {/* Stat bawah donut */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-xl bg-retain/10 border border-retain/20 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-retain" />
                      <span className="text-xs font-semibold text-retain">Aktif</span>
                    </div>
                    <span className="font-display font-bold text-fg tabular-nums">{m.active_customers.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-churn/10 border border-churn/20 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-churn" />
                      <span className="text-xs font-semibold text-churn">Churn</span>
                    </div>
                    <span className="font-display font-bold text-fg tabular-nums">{m.churned_customers.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-surface-2/50 border border-border/60 px-3 py-2">
                    <span className="text-xs font-semibold text-muted">Total</span>
                    <span className="font-display font-bold text-fg tabular-nums">{m.total_customers.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </Card>
              <Card className="lg:col-span-2" delay={0.15}>
                <CardHeader title="Ringkasan Performa Model" subtitle="Metrik evaluasi Random Forest pada data uji" />
                <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
                  {[
                    ["Accuracy", m.model.accuracy, "Akurasi keseluruhan klasifikasi"],
                    ["Precision", m.model.precision, "Ketepatan prediksi churn"],
                    ["Recall", m.model.recall, "Sensitivitas mendeteksi churn"],
                    ["F1 Score", m.model.f1_score, "Keseimbangan Precision-Recall"],
                    ["ROC-AUC", m.model.roc_auc, "Kemampuan pemisahan kelas"],
                  ].map(([label, val, desc]) => (
                    <div key={label as string} className="group rounded-2xl border border-border/80 bg-surface-2/40 p-4 transition-all duration-200 hover:border-brand/30 hover:bg-surface-2/70">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-muted">{label}</div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <div className="mt-1.5 font-display text-2xl font-bold text-fg tabular-nums">{score(val as number)}</div>
                      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border/60">
                        <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${(val as number) * 100}%` }} />
                      </div>
                      <div className="mt-2 text-[10px] text-muted/70">{desc as string}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </DataBoundary>
    </>
  );
}

