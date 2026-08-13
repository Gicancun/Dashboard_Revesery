// Halaman utama: Explainable AI dengan SHAP.
// Mendukung dua sumber: (1) data JSON → dirender ulang dengan Plotly/Chart.js,
// (2) HTML hasil export shap.save_html() dari Colab → ditampilkan via iframe.
import { Sparkles, Globe, Crosshair } from "lucide-react";
import { useJsonData } from "@/hooks/useJsonData";
import { DataBoundary } from "@/components/ui/DataBoundary";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader } from "@/components/ui/Card";
import { Skeleton, EmptyState } from "@/components/ui/States";
import { AcademicNote } from "@/components/ui/AcademicNote";
import { HBarChart } from "@/components/charts/HBarChart";
import { ShapSummary } from "@/components/shap/ShapSummary";
import { ShapWaterfall } from "@/components/shap/ShapWaterfall";
import { ShapForce } from "@/components/shap/ShapForce";
import { ShapDecision } from "@/components/shap/ShapDecision";
import { ShapDependence } from "@/components/shap/ShapDependence";
import { ShapHtmlEmbed } from "@/components/shap/ShapHtmlEmbed";
import { pct, score } from "@/utils/format";
import type { ShapData } from "@/types";

function Scope({ type }: { type: "global" | "local" }) {
  const map = {
    global: { icon: Globe, label: "Global Explanation", tone: "bg-brand/10 text-brand" },
    local: { icon: Crosshair, label: "Local Explanation", tone: "bg-accent/10 text-accent" },
  } as const;
  const { icon: Icon, label, tone } = map[type];
  return <span className={`chip ${tone}`}><Icon className="h-3.5 w-3.5" /> {label}</span>;
}

/** Narasi akademik Force Plot — dihitung dari data pelanggan yang sedang ditampilkan,
 * bukan teks generik, supaya angka & fitur dominannya selalu sesuai apa yang terlihat. */
function ForceInterpretation({ force }: { force: NonNullable<ShapData["force"]> }) {
  const pos = [...force.features].filter((f) => f.value > 0).sort((a, b) => b.value - a.value);
  const neg = [...force.features].filter((f) => f.value < 0).sort((a, b) => a.value - b.value);
  const topPos = pos[0];
  const topNeg = neg[0];
  const delta = force.prediction - force.base_value;

  return (
    <>
      Force plot menampilkan "tarik-menarik" antar fitur pada satu prediksi. Fitur merah mendorong ke arah churn,
      fitur biru menahannya — panjang segmen sebanding dengan besar kontribusinya. Untuk pelanggan ini, prediksi
      model mencapai <strong className="text-fg">{pct(force.prediction)}</strong> probabilitas churn, bergerak{" "}
      {delta >= 0 ? "naik" : "turun"} <strong className="text-fg">{score(Math.abs(delta))}</strong> dari base value{" "}
      <strong className="text-fg">{score(force.base_value)}</strong> (rata-rata prediksi model sebelum melihat
      fitur spesifik pelanggan).{" "}
      {topPos && (
        <>
          Faktor pendorong terbesar adalah <em>{topPos.feature}</em> (+{score(topPos.value)})
          {topNeg ? (
            <>, ditahan sebagian oleh <em>{topNeg.feature}</em> ({score(topNeg.value)}).</>
          ) : (
            <>, tanpa faktor penahan (biru) yang berarti — seluruh fitur teratas kompak mendorong ke arah yang sama, menandakan profil risiko pelanggan ini cukup konsisten.</>
          )}
        </>
      )}
    </>
  );
}

export default function Shap() {
  const state = useJsonData<ShapData>("shap.json");
  return (
    <>
      <SectionHeading
        eyebrow="Pemodelan · Halaman Utama"
        title="Explainable AI dengan SHAP"
        description="SHAP (SHapley Additive exPlanations) menguraikan kontribusi setiap fitur terhadap prediksi churn — menjadikan model Random Forest transparan dan dapat dipertanggungjawabkan secara akademik."
      />

      {/* Pengantar konsep */}
      <Card className="mb-6" delay={0}>
        <div className="flex gap-4">
          <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand sm:grid"><Sparkles className="h-6 w-6" /></span>
          <div>
            <h3 className="font-display text-base font-semibold text-fg">Mengapa SHAP?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              SHAP berlandaskan teori permainan (<em>Shapley values</em>): setiap fitur diperlakukan sebagai "pemain"
              yang berkontribusi terhadap selisih antara prediksi dan nilai dasar (<em>base value</em>). Nilai SHAP
              positif mendorong prediksi ke arah churn, sedangkan nilai negatif menurunkannya. Pendekatan ini bersifat
              <em> additive</em> dan konsisten, sehingga mampu menjelaskan model secara <strong>global</strong>
              (pola umum) maupun <strong>lokal</strong> (satu pelanggan tertentu).
            </p>
          </div>
        </div>
      </Card>

      <DataBoundary state={state} skeleton={<div className="grid gap-4 lg:grid-cols-2"><Skeleton className="h-96" /><Skeleton className="h-96" /></div>}>
        {(s) => (
          <div className="space-y-6">
            {/* Global: Summary + Bar */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card delay={0.05}>
                <CardHeader title="SHAP Summary Plot" subtitle="Beeswarm — dampak & arah tiap fitur" right={<Scope type="global" />} />
                {s.summary?.length ? <ShapSummary data={s.summary} /> : <EmptyState text="Data summary belum tersedia." />}
                <AcademicNote>
                  Setiap titik mewakili satu pelanggan. Posisi horizontal menunjukkan besar & arah pengaruh (SHAP),
                  sementara warna menyatakan nilai fitur (biru = rendah, merah = tinggi). Pola warna terhadap posisi
                  mengungkap <em>bagaimana</em> sebuah fitur memengaruhi risiko churn.
                </AcademicNote>
              </Card>

              <Card delay={0.1}>
                <CardHeader title="SHAP Bar Plot" subtitle="Rata-rata |SHAP| — kepentingan fitur global" right={<Scope type="global" />} />
                {s.global_importance?.length ? (
                  <HBarChart items={s.global_importance.slice(0, 10).map((f) => ({ name: f.feature, value: f.value }))} color="rgb(var(--info))" />
                ) : <EmptyState text="Data global importance belum tersedia." />}
                <AcademicNote>
                  Bar plot merangkum rata-rata besaran absolut nilai SHAP setiap fitur. Semakin panjang batang,
                  semakin besar pengaruh rata-rata fitur tersebut terhadap keputusan model secara keseluruhan.
                </AcademicNote>
              </Card>
            </div>

            {/* Local: Waterfall + Force */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card delay={0.05}>
                <CardHeader title="SHAP Waterfall Plot" subtitle="Rincian satu prediksi pelanggan" right={<Scope type="local" />} />
                {s.waterfall ? <ShapWaterfall data={s.waterfall} /> : <EmptyState text="Data waterfall belum tersedia." />}
                <AcademicNote>
                  Waterfall memvisualisasikan bagaimana prediksi untuk <em>satu</em> pelanggan terbentuk: dimulai dari
                  base value, tiap fitur menambah (merah) atau mengurangi (biru) risiko hingga mencapai prediksi akhir.
                  Sangat berguna untuk menjelaskan keputusan model kepada tim bisnis.
                </AcademicNote>
              </Card>

              <Card delay={0.1}>
                <CardHeader title="SHAP Force Plot" subtitle="Gaya pendorong prediksi" right={<Scope type="local" />} />
                {s.force ? <ShapForce data={s.force} /> : (s.html?.force ? <ShapHtmlEmbed html={s.html.force} height={180} /> : <EmptyState text="Data force belum tersedia." />)}
                <AcademicNote>
                  {s.force ? <ForceInterpretation force={s.force} /> : (
                    <>Force plot menampilkan "tarik-menarik" antar fitur pada satu prediksi. Fitur merah mendorong ke
                    arah churn, fitur biru menahannya. Panjang segmen sebanding dengan besar kontribusinya.</>
                  )}
                </AcademicNote>
              </Card>
            </div>

            {/* Decision + Dependence */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card delay={0.05}>
                <CardHeader title="SHAP Decision Plot" subtitle="Jalur keputusan beberapa sampel" right={<Scope type="local" />} />
                {s.decision ? <ShapDecision data={s.decision} /> : <EmptyState text="Data decision belum tersedia." />}
                <AcademicNote>
                  Decision plot menelusuri akumulasi kontribusi fitur dari base value hingga prediksi akhir untuk
                  beberapa pelanggan sekaligus, memperlihatkan pada fitur mana jalur keputusan mulai bercabang.
                </AcademicNote>
              </Card>

              <Card delay={0.1}>
                <CardHeader title="SHAP Dependence Plot" subtitle={s.dependence ? `Fitur: ${s.dependence.feature}` : "Efek & interaksi fitur"} right={<Scope type="global" />} />
                {s.dependence ? <ShapDependence data={s.dependence} /> : <EmptyState text="Data dependence belum tersedia." />}
                <AcademicNote>
                  Dependence plot memetakan nilai sebuah fitur (sumbu-X) terhadap nilai SHAP-nya (sumbu-Y),
                  mengungkap hubungan non-linear dan efek interaksi dengan fitur lain (ditunjukkan melalui warna).
                </AcademicNote>
              </Card>
            </div>

            {/* HTML embed dari Colab (opsional) */}
            {s.html?.summary && (
              <Card delay={0.1}>
                <CardHeader title="SHAP Interaktif (Export dari Google Colab)" subtitle="Ditampilkan langsung dari file HTML hasil shap.save_html()" />
                <ShapHtmlEmbed html={s.html.summary} height={420} />
              </Card>
            )}
          </div>
        )}
      </DataBoundary>
    </>
  );
}
