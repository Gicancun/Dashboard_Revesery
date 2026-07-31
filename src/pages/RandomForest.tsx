// Halaman Random Forest: penjelasan algoritma + seluruh evaluasi model.
import { Trees } from "lucide-react";
import { useJsonData } from "@/hooks/useJsonData";
import { DataBoundary } from "@/components/ui/DataBoundary";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/States";
import { AcademicNote } from "@/components/ui/AcademicNote";
import { ConfusionMatrix } from "@/components/charts/ConfusionMatrix";
import { CurveChart } from "@/components/charts/CurveChart";
import { HBarChart } from "@/components/charts/HBarChart";
import { score } from "@/utils/format";
import type { Metrics, FeatureImportance } from "@/types";
import { useChartTheme } from "@/hooks/useChartTheme";

function MetricPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/50 p-4 text-center">
      <div className="font-display text-2xl font-bold text-fg tabular-nums">{score(value)}</div>
      <div className="mt-1 text-xs font-medium text-muted">{label}</div>
    </div>
  );
}

export default function RandomForest() {
  const metricsState = useJsonData<Metrics>("metrics.json");
  const fiState = useJsonData<FeatureImportance>("feature_importance.json");
  const c = useChartTheme();

  return (
    <>
      <SectionHeading
        eyebrow="Pemodelan"
        title="Random Forest Classifier"
        description="Evaluasi menyeluruh model klasifikasi churn: matriks kebingungan, kurva ROC & Precision-Recall, kepentingan fitur, hingga learning curve."
      />

      {/* Penjelasan algoritma */}
      <Card className="mb-6" delay={0}>
        <div className="flex gap-4">
          <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand sm:grid"><Trees className="h-6 w-6" /></span>
          <div>
            <h3 className="font-display text-base font-semibold text-fg">Bagaimana Random Forest bekerja?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Random Forest adalah algoritma <em>ensemble</em> yang membangun banyak pohon keputusan (<em>decision trees</em>)
              dari sampel data dan subset fitur acak (teknik <em>bagging</em>). Prediksi akhir ditentukan melalui
              pemungutan suara mayoritas dari seluruh pohon. Pendekatan ini menurunkan <em>variance</em>, mengurangi
              risiko <em>overfitting</em>, dan menghasilkan model yang tangguh terhadap outlier — cocok untuk data
              churn yang memiliki banyak fitur bertipe campuran.
            </p>
          </div>
        </div>
      </Card>

      <DataBoundary state={metricsState} skeleton={<Skeleton className="h-64" />}>
        {(m) => (
          <div className="space-y-6">
            {/* Metrik */}
            <Card delay={0.05}>
              <CardHeader title="Metrik Evaluasi" subtitle="Kinerja model pada data uji" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <MetricPill label="Accuracy" value={m.model.accuracy} />
                <MetricPill label="Precision" value={m.model.precision} />
                <MetricPill label="Recall" value={m.model.recall} />
                <MetricPill label="F1 Score" value={m.model.f1_score} />
                <MetricPill label="ROC-AUC" value={m.model.roc_auc} />
              </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Confusion Matrix */}
              <Card delay={0.05}>
                <CardHeader title="Confusion Matrix" subtitle="Perbandingan prediksi vs aktual" />
                <ConfusionMatrix matrix={m.confusion_matrix} labels={m.confusion_labels} />
                <AcademicNote>
                  Sel diagonal (TN & TP) menunjukkan prediksi yang benar. Dalam konteks churn, <em>False Negative</em> (FN)
                  — pelanggan yang sebenarnya churn namun tidak terdeteksi — paling merugikan bisnis karena kehilangan
                  peluang retensi. Karena itu <em>recall</em> menjadi metrik yang perlu diprioritaskan.
                </AcademicNote>
              </Card>

              {/* ROC */}
              <Card delay={0.1}>
                <CardHeader title="ROC Curve" subtitle={`Area Under Curve (AUC) = ${score(m.model.roc_auc)}`} />
                <CurveChart
                  diagonal
                  xLabel="False Positive Rate"
                  yLabel="True Positive Rate"
                  series={[{ label: `ROC (AUC ${score(m.model.roc_auc)})`, x: m.roc_curve.fpr, y: m.roc_curve.tpr, color: c.brand }]}
                />
                <AcademicNote>
                  Kurva ROC menggambarkan trade-off antara <em>true positive rate</em> dan <em>false positive rate</em>.
                  Semakin kurva mendekati sudut kiri-atas (AUC → 1), semakin baik kemampuan model membedakan pelanggan
                  churn dari yang bertahan. AUC 0,5 setara tebakan acak.
                </AcademicNote>
              </Card>

              {/* PR Curve */}
              <Card delay={0.05}>
                <CardHeader title="Precision-Recall Curve" subtitle="Relevan untuk data tidak seimbang" />
                <CurveChart
                  xLabel="Recall"
                  yLabel="Precision"
                  series={[{ label: "Precision-Recall", x: m.pr_curve.recall, y: m.pr_curve.precision, color: c.accent }]}
                />
                <AcademicNote>
                  Pada dataset churn yang tidak seimbang, kurva Precision-Recall memberi gambaran lebih jujur
                  dibanding ROC. Kurva yang tetap tinggi menunjukkan model mampu menjaga <em>precision</em>
                  sekaligus menangkap banyak kasus churn (<em>recall</em> tinggi).
                </AcademicNote>
              </Card>

              {/* Feature Importance */}
              <Card delay={0.1}>
                <CardHeader title="Feature Importance" subtitle="Kontribusi fitur menurut Random Forest" />
                <DataBoundary state={fiState} skeleton={<Skeleton className="h-64" />}>
                  {(fi) => (
                    <>
                      <HBarChart items={fi.features.slice(0, 10).map((f) => ({ name: f.name, value: f.importance }))} />
                      <AcademicNote>
                        Kepentingan fitur dihitung dari penurunan <em>impurity</em> (Gini) rata-rata di seluruh pohon.
                        Nilai ini bersifat global namun tidak menunjukkan arah pengaruh — untuk itu diperlukan
                        analisis SHAP pada halaman berikutnya.
                      </AcademicNote>
                    </>
                  )}
                </DataBoundary>
              </Card>
            </div>

            {/* Learning Curve */}
            {m.learning_curve && (
              <Card delay={0.1}>
                <CardHeader title="Learning Curve — Training vs Validation" subtitle="Skor model terhadap ukuran data latih" />
                <CurveChart
                  height={320}
                  xLabel="Proporsi data latih"
                  yLabel="Skor"
                  series={[
                    { label: "Training", x: m.learning_curve.train_sizes, y: m.learning_curve.train_scores, color: c.brand },
                    { label: "Validation", x: m.learning_curve.train_sizes, y: m.learning_curve.val_scores, color: c.retain },
                  ]}
                />
                <AcademicNote>
                  Selisih kecil antara kurva <em>training</em> dan <em>validation</em> menandakan model
                  ter-generalisasi dengan baik (tidak overfitting). Jika kurva training jauh di atas validation,
                  model terlalu menghafal data latih.
                </AcademicNote>
              </Card>
            )}
          </div>
        )}
      </DataBoundary>
    </>
  );
}
