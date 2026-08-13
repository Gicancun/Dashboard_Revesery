// Halaman Dataset: statistik data, class imbalance, preview tabel interaktif,
// dan fitur upload Excel live ke FastAPI Backend.
import { useState } from "react";
import { Rows3, Columns3, CircleSlash, Copy, UploadCloud, FileText, Scale, Loader2, CheckCircle2 } from "lucide-react";
import { useApiData } from "@/hooks/useJsonData";
import { DataBoundary } from "@/components/ui/DataBoundary";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/States";
import { AcademicNote } from "@/components/ui/AcademicNote";
import { DataTable } from "@/components/ui/DataTable";
import { DonutChart } from "@/components/charts/DonutChart";
import { nf } from "@/utils/format";
import { apiUrl, readErrorDetail } from "@/utils/api";
import type { DatasetInfo } from "@/types";

function StatTile({ icon: Icon, label, value }: { icon: typeof Rows3; label: string; value: string }) {
  return (
    <div className="card card-glass flex items-center gap-4 p-5">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand/15 border border-brand/20 text-brand-soft">
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</div>
        <div className="font-display text-xl font-extrabold text-fg tabular-nums sm:text-2xl">{value}</div>
      </div>
    </div>
  );
}

/** Kartu upload Excel — kirim ke FastAPI backend /api/upload atau preview lokal. */
function ExcelUploader({ onUploaded }: { onUploaded: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFile = async (file: File) => {
    setStatusMsg(null);
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setStatusMsg({ type: "error", text: "File harus berformat Excel (.xlsx atau .xls)" });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(apiUrl("upload"), {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        // 400 (bukan .xlsx), 409 (pipeline lain berjalan), 413 (terlalu besar), 401, 422, 500 —
        // semua kirim `detail` yang actionable, tampilkan apa adanya.
        const detail = await readErrorDetail(res);
        throw new Error(detail ?? `Gagal mengunggah file (HTTP ${res.status}).`);
      }

      setStatusMsg({
        type: "success",
        text: `File "${file.name}" berhasil diunggah! Engine Machine Learning sedang mengolah ulang data...`,
      });
      // Refetch SEKARANG (bukan ditunda) supaya banner error lama langsung hilang
      // begitu upload sukses, alih-alih nyangkut berdampingan dengan pesan sukses
      // di atas selama beberapa detik. useApiData akan otomatis poll tiap 3 detik
      // selama backend melaporkan status 503 "masih training".
      onUploaded();
    } catch (err) {
      setStatusMsg({ type: "error", text: (err as Error).message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card delay={0.1}>
      <CardHeader
        title="Upload Dataset Live (FastAPI Backend)"
        subtitle="Unggah Transaction_Revesery.xlsx untuk memproses ulang data cleaning, pemodelan Random Forest, dan SHAP secara real-time."
      />
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        className="group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/80 bg-surface-2/30 px-6 py-10 text-center transition-all duration-200 hover:border-brand/50 hover:bg-surface-2/60"
      >
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 border border-brand/20 text-brand-soft">
          {uploading ? <Loader2 className="h-7 w-7 animate-spin" /> : <UploadCloud className="h-7 w-7" />}
        </div>
        <div>
          <span className="text-base font-bold text-fg">Tarik file Excel (.xlsx) ke sini atau klik untuk memilih</span>
          <p className="mt-1 text-xs text-muted">Format standar: Transaction_Revesery.xlsx (Maks. 50 MB)</p>
        </div>
        <input
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </label>

      {statusMsg && (
        <div
          className={`mt-4 flex items-center gap-2.5 rounded-xl border p-4 text-sm font-medium ${
            statusMsg.type === "success"
              ? "border-retain/30 bg-retain/10 text-retain"
              : "border-churn/30 bg-churn/10 text-churn"
          }`}
        >
          {statusMsg.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <FileText className="h-5 w-5 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}
    </Card>
  );
}

function DatasetSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}

export default function Dataset() {
  const { data, loading, error, waiting, noDataYet, refetch } = useApiData<DatasetInfo>("dataset");
  const state = { data, loading, error, waiting, noDataYet };

  return (
    <>
      <SectionHeading
        eyebrow="Data Pipeline"
        title="Dataset & Data Cleaning"
        description="Gambaran umum kualitas data, struktur fitur, class imbalance, serta riwayat pembersihan data pelanggan Revesery Store."
      />
      <DataBoundary state={state} skeleton={<DatasetSkeleton />}>
        {(d) => {
          const majority = Math.max(...d.class_distribution.map((c) => c.count));
          const minority = Math.min(...d.class_distribution.map((c) => c.count));
          const ratio = (majority / Math.max(1, minority)).toFixed(2);
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatTile icon={Rows3} label="Jumlah Data Raw" value={nf(d.n_rows)} />
                <StatTile icon={Columns3} label="Jumlah Fitur" value={nf(d.n_features)} />
                <StatTile icon={CircleSlash} label="Missing Value" value={nf(d.missing_values)} />
                <StatTile icon={Copy} label="Duplikat Raw" value={nf(d.duplicates)} />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <Card delay={0.05}>
                  <CardHeader
                    title="Class Imbalance"
                    subtitle={`Distribusi target "${d.target}"`}
                    right={<span className="chip bg-warn/15 border border-warn/20 text-warn"><Scale className="h-3.5 w-3.5" /> Rasio {ratio}:1</span>}
                  />
                  <DonutChart data={d.class_distribution} colors={["rgb(var(--info-dark))", "rgb(var(--info))"]} height={240} />
                  <AcademicNote>
                    Ketidakseimbangan kelas ({ratio}:1) membuat metrik <em>precision</em>, <em>recall</em>, dan <em>F1-score</em> jauh lebih krusial dibandingkan sekadar <em>accuracy</em>. Penyeimbangan menggunakan <code>class_weight='balanced'</code> diterapkan pada Random Forest.
                  </AcademicNote>
                </Card>

                <Card className="lg:col-span-2" delay={0.1}>
                  <CardHeader title="Deskripsi Fitur Dataset" subtitle="Struktur kolom dan tipe data" />
                  <div className="max-h-[340px] overflow-y-auto pr-1">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-surface">
                        <tr className="border-b border-border/80 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                          <th className="py-2.5 pr-4">Kolom</th>
                          <th className="py-2.5 pr-4">Tipe Data</th>
                          <th className="py-2.5">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {d.columns.map((c) => (
                          <tr key={c.name} className="border-b border-border/40 last:border-0 hover:bg-surface-2/30">
                            <td className="py-2.5 pr-4 font-semibold text-fg">{c.name}</td>
                            <td className="py-2.5 pr-4"><span className="chip bg-brand/10 border border-brand/20 text-brand-soft font-mono text-[11px]">{c.dtype}</span></td>
                            <td className="py-2.5 text-muted">{c.description ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              <Card delay={0.1}>
                <CardHeader title="Preview Data Transaksi" subtitle="Pratinjau data mentah interaktif — telusuri dan cari baris data" />
                <DataTable rows={d.preview} />
              </Card>

            </div>
          );
        }}
      </DataBoundary>

      {/* Upload widget selalu tampil agar user bisa upload kapan saja */}
      <ExcelUploader onUploaded={refetch} />
    </>
  );
}

