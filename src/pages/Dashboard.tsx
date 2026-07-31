// Halaman Dashboard: ringkasan penelitian — KPI utama + tren + komposisi churn.
import { Users, UserMinus, Activity, Target, Crosshair, Radar, Gauge, TrendingDown } from "lucide-react";
import { useJsonData } from "@/hooks/useJsonData";
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
  const state = useJsonData<Metrics>("metrics.json");

  return (
    <>
      <SectionHeading
        eyebrow="Ringkasan Penelitian"
        title="Analisis Customer Churn Revesery Store"
        description="Dashboard interaktif hasil pemodelan Random Forest dan interpretasi Explainable AI (SHAP) untuk mendukung strategi retensi pelanggan."
      />

      <DataBoundary state={state} skeleton={<DashboardSkeleton />}>
        {(m) => (
          <div className="space-y-6">
            {/* KPI utama */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <KpiCard label="Jumlah Customer" value={m.total_customers} icon={Users} tone="brand" delay={0} />
              <KpiCard label="Customer Churn" value={m.churned_customers} icon={UserMinus} tone="churn" delay={0.05} />
              <KpiCard label="Churn Rate" value={m.churn_rate} icon={TrendingDown} tone="churn" format={(v) => pct(v)} delay={0.1} />
              <KpiCard label="Customer Aktif" value={m.active_customers} icon={Activity} tone="retain" delay={0.15} />
              <KpiCard label="Accuracy Model" value={m.model.accuracy} icon={Gauge} tone="accent" format={score} delay={0.2} />
              <KpiCard label="Precision" value={m.model.precision} icon={Crosshair} tone="accent" format={score} delay={0.25} />
              <KpiCard label="Recall" value={m.model.recall} icon={Radar} tone="accent" format={score} delay={0.3} />
              <KpiCard label="F1 · ROC-AUC" value={m.model.f1_score} icon={Target} tone="brand"
                format={(v) => `${score(v)} · ${score(m.model.roc_auc)}`} delay={0.35} hint="F1 Score · ROC-AUC" />
            </div>

            {/* Tren + komposisi */}
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2" delay={0.1}>
                <CardHeader title="Tren Customer" subtitle="Perkembangan total pelanggan dan churn per periode" />
                <TrendLineChart data={m.customer_trend} />
              </Card>
              <Card delay={0.15}>
                <CardHeader title="Proporsi Churn" subtitle="Pie chart pelanggan churn" />
                <DonutChart
                  variant="pie"
                  data={[
                    { label: "Churn", count: m.churned_customers },
                    { label: "Bertahan", count: m.active_customers },
                  ]}
                  height={260}
                />
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card delay={0.1}>
                <CardHeader title="Aktif vs Churn" subtitle="Donut komposisi pelanggan" />
                <DonutChart
                  data={[
                    { label: "Aktif", count: m.active_customers },
                    { label: "Churn", count: m.churned_customers },
                  ]}
                  colors={["rgb(var(--retain))", "rgb(var(--churn))"]}
                  height={260}
                />
              </Card>
              <Card className="lg:col-span-2" delay={0.15}>
                <CardHeader title="Ringkasan Performa Model" subtitle="Metrik evaluasi Random Forest pada data uji" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    ["Accuracy", m.model.accuracy], ["Precision", m.model.precision],
                    ["Recall", m.model.recall], ["F1 Score", m.model.f1_score],
                    ["ROC-AUC", m.model.roc_auc],
                  ].map(([label, val]) => (
                    <div key={label as string} className="rounded-xl border border-border bg-surface-2/50 p-4">
                      <div className="text-xs font-medium text-muted">{label}</div>
                      <div className="mt-1 font-display text-xl font-bold text-fg tabular-nums">{score(val as number)}</div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                        <div className="h-full rounded-full bg-brand" style={{ width: `${(val as number) * 100}%` }} />
                      </div>
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
