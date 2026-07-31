// Halaman Exploratory Data Analysis: distribusi, korelasi, dan sebaran fitur.
import { useJsonData } from "@/hooks/useJsonData";
import { DataBoundary } from "@/components/ui/DataBoundary";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/States";
import { AcademicNote } from "@/components/ui/AcademicNote";
import { DonutChart } from "@/components/charts/DonutChart";
import { CategoricalBar } from "@/components/charts/CategoricalBar";
import { Histogram } from "@/components/charts/Histogram";
import { Boxplot } from "@/components/charts/Boxplot";
import { Heatmap } from "@/components/charts/Heatmap";
import type { EdaData } from "@/types";

function EdaSkeleton() {
  return <div className="grid gap-4 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72" />)}</div>;
}

export default function Eda() {
  const state = useJsonData<EdaData>("eda.json");
  return (
    <>
      <SectionHeading
        eyebrow="Data"
        title="Exploratory Data Analysis"
        description="Eksplorasi pola dan hubungan antar variabel untuk memahami karakteristik pelanggan yang churn sebelum pemodelan."
      />
      <DataBoundary state={state} skeleton={<EdaSkeleton />}>
        {(e) => (
          <div className="space-y-6">
            {/* Distribusi target + kategorikal */}
            <div className="grid gap-4 lg:grid-cols-3">
              <Card delay={0.05}>
                <CardHeader title="Distribusi Churn" subtitle="Proporsi pelanggan churn vs bertahan" />
                <DonutChart data={e.churn_distribution} colors={["rgb(var(--retain))", "rgb(var(--churn))"]} height={240} />
              </Card>
              {e.categorical.slice(0, 2).map((c, i) => (
                <Card key={c.feature} delay={0.1 + i * 0.05}>
                  <CardHeader title={`Churn per ${c.feature}`} subtitle="Perbandingan bertahan vs churn" />
                  <CategoricalBar data={c} height={240} />
                </Card>
              ))}
            </div>

            {e.categorical.length > 2 && (
              <div className="grid gap-4 lg:grid-cols-3">
                {e.categorical.slice(2).map((c, i) => (
                  <Card key={c.feature} delay={0.05 + i * 0.05}>
                    <CardHeader title={`Churn per ${c.feature}`} subtitle="Distribusi kategori" />
                    <CategoricalBar data={c} height={240} />
                  </Card>
                ))}
              </div>
            )}

            {/* Histogram fitur numerik */}
            <div className="grid gap-4 lg:grid-cols-2">
              {e.histograms.map((h, i) => (
                <Card key={h.feature} delay={0.05 + i * 0.05}>
                  <CardHeader title={`Distribusi ${h.feature}`} subtitle="Histogram (bertumpuk per status churn)" />
                  <Histogram data={h} height={260} />
                </Card>
              ))}
            </div>

            {/* Boxplot */}
            {e.boxplots.length > 0 && (
              <div className="grid gap-4 lg:grid-cols-2">
                {e.boxplots.map((b, i) => (
                  <Card key={b.feature} delay={0.05 + i * 0.05}>
                    <CardHeader title={`Boxplot ${b.feature}`} subtitle="Sebaran & outlier per kelompok" />
                    <Boxplot data={b} height={b.groups.length * 54 + 30} />
                  </Card>
                ))}
              </div>
            )}

            {/* Correlation heatmap */}
            <Card delay={0.1}>
              <CardHeader title="Correlation Heatmap" subtitle="Korelasi Pearson antar fitur numerik" />
              <Heatmap data={e.correlation} />
              <div className="mt-3 flex items-center gap-4 text-[11px] text-muted">
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: "rgb(var(--accent))" }} /> Korelasi negatif</span>
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: "rgb(var(--churn))" }} /> Korelasi positif</span>
              </div>
              <AcademicNote>
                Heatmap menampilkan koefisien korelasi (−1 hingga +1). Korelasi yang sangat tinggi antar dua
                fitur mengindikasikan <em>multikolinearitas</em>, yang meski tidak mengganggu prediksi Random Forest,
                dapat menyebabkan <em>feature importance</em> terbagi di antara fitur-fitur yang berkorelasi.
              </AcademicNote>
            </Card>

            {/* Missing value heatmap (opsional) */}
            {e.missing_matrix && (
              <Card delay={0.1}>
                <CardHeader title="Missing Value" subtitle="Persentase nilai hilang per kolom" />
                <div className="space-y-2">
                  {e.missing_matrix.columns.map((col, i) => {
                    const p = e.missing_matrix!.missing_pct[i];
                    return (
                      <div key={col} className="flex items-center gap-3">
                        <span className="w-32 shrink-0 truncate text-sm text-muted">{col}</span>
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-2">
                          <div className="h-full rounded-full" style={{ width: `${Math.max(2, p)}%`, background: p > 0 ? "rgb(var(--warn))" : "rgb(var(--retain))" }} />
                        </div>
                        <span className="w-12 text-right text-xs tabular-nums text-muted">{p.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}
      </DataBoundary>
    </>
  );
}
