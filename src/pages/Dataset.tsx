// Halaman Dataset: statistik data, class imbalance, preview tabel interaktif,
// dan fitur upload CSV (hanya prototype — tidak dikirim ke server).
import { useState } from "react";
import { Rows3, Columns3, CircleSlash, Copy, UploadCloud, FileText, Scale } from "lucide-react";
import { useJsonData } from "@/hooks/useJsonData";
import { DataBoundary } from "@/components/ui/DataBoundary";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/States";
import { AcademicNote } from "@/components/ui/AcademicNote";
import { DataTable } from "@/components/ui/DataTable";
import { DonutChart } from "@/components/charts/DonutChart";
import { parseCsv } from "@/utils/csv";
import { nf } from "@/utils/format";
import type { DatasetInfo } from "@/types";

function StatTile({ icon: Icon, label, value }: { icon: typeof Rows3; label: string; value: string }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand"><Icon className="h-5 w-5" /></span>
      <div>
        <div className="text-xs font-medium text-muted">{label}</div>
        <div className="font-display text-lg font-bold text-fg tabular-nums">{value}</div>
      </div>
    </div>
  );
}

/** Kartu upload CSV — memvalidasi & menampilkan preview tanpa backend. */
function CsvUploader() {
  const [preview, setPreview] = useState<Record<string, string>[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleFile = (file: File) => {
    setError("");
    if (!file.name.endsWith(".csv")) { setError("File harus berformat .csv"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const { rows } = parseCsv(String(reader.result));
        if (rows.length === 0) { setError("File CSV kosong atau tidak terbaca."); return; }
        setFileName(file.name);
        setPreview(rows.slice(0, 20));
      } catch {
        setError("Gagal membaca file CSV.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card delay={0.1}>
      <CardHeader title="Upload Dataset (Prototype)" subtitle="Unggah .csv untuk pratinjau — diproses lokal di browser, tidak dikirim ke server." />
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface-2/40 px-4 py-8 text-center transition-colors hover:border-brand/50"
      >
        <UploadCloud className="h-8 w-8 text-brand" />
        <span className="text-sm font-medium text-fg">Tarik file .csv ke sini atau klik untuk memilih</span>
        <span className="text-xs text-muted">Hanya untuk demonstrasi antarmuka</span>
        <input type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </label>
      {error && <p className="mt-3 text-sm text-churn">{error}</p>}
      {preview && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted">
            <FileText className="h-4 w-4" /> <span className="font-medium text-fg">{fileName}</span> · pratinjau {preview.length} baris pertama
          </div>
          <DataTable rows={preview} pageSize={5} />
        </div>
      )}
    </Card>
  );
}

function DatasetSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      <Skeleton className="h-96" />
    </div>
  );
}

export default function Dataset() {
  const state = useJsonData<DatasetInfo>("dataset.json");
  return (
    <>
      <SectionHeading
        eyebrow="Data"
        title="Dataset Penelitian"
        description="Gambaran umum kualitas dan struktur dataset pelanggan Revesery Store yang digunakan untuk pemodelan."
      />
      <DataBoundary state={state} skeleton={<DatasetSkeleton />}>
        {(d) => {
          const majority = Math.max(...d.class_distribution.map((c) => c.count));
          const minority = Math.min(...d.class_distribution.map((c) => c.count));
          const ratio = (majority / Math.max(1, minority)).toFixed(2);
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatTile icon={Rows3} label="Jumlah Data" value={nf(d.n_rows)} />
                <StatTile icon={Columns3} label="Jumlah Fitur" value={nf(d.n_features)} />
                <StatTile icon={CircleSlash} label="Missing Value" value={nf(d.missing_values)} />
                <StatTile icon={Copy} label="Duplikat" value={nf(d.duplicates)} />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <Card delay={0.05}>
                  <CardHeader title="Class Imbalance" subtitle={`Distribusi target "${d.target}"`}
                    right={<span className="chip bg-warn/10 text-warn"><Scale className="h-3.5 w-3.5" /> Rasio {ratio}:1</span>} />
                  <DonutChart data={d.class_distribution} colors={["rgb(var(--retain))", "rgb(var(--churn))"]} height={240} />
                  <AcademicNote>
                    Ketidakseimbangan kelas ({ratio}:1) berpotensi membuat model bias ke kelas mayoritas.
                    Karena itu metrik <em>precision</em>, <em>recall</em>, dan <em>F1-score</em> lebih relevan
                    daripada sekadar <em>accuracy</em>, dan teknik penyeimbangan (mis. SMOTE / class weight) dapat dipertimbangkan.
                  </AcademicNote>
                </Card>

                <Card className="lg:col-span-2" delay={0.1}>
                  <CardHeader title="Deskripsi Fitur" subtitle="Struktur kolom dataset" />
                  <div className="max-h-[320px] overflow-y-auto pr-1">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-surface">
                        <tr className="border-b border-border text-left text-xs text-muted">
                          <th className="py-2 pr-3 font-semibold">Kolom</th>
                          <th className="py-2 pr-3 font-semibold">Tipe</th>
                          <th className="py-2 font-semibold">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {d.columns.map((c) => (
                          <tr key={c.name} className="border-b border-border/50 last:border-0">
                            <td className="py-2 pr-3 font-medium text-fg">{c.name}</td>
                            <td className="py-2 pr-3"><span className="chip bg-surface-2 text-muted font-mono">{c.dtype}</span></td>
                            <td className="py-2 text-muted">{c.description ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              <Card delay={0.1}>
                <CardHeader title="Preview Dataset" subtitle="Tabel interaktif — cari, urutkan, dan telusuri data" />
                <DataTable rows={d.preview} />
              </Card>

              <CsvUploader />
            </div>
          );
        }}
      </DataBoundary>
    </>
  );
}
