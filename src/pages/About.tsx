// Halaman Tentang Penelitian: metadata skripsi + diagram alur penelitian.
import { motion } from "framer-motion";
import { GraduationCap, User, Building2, FlaskConical, Database, Trees, Sparkles, ArrowRight } from "lucide-react";
import { useJsonData } from "@/hooks/useJsonData";
import { DataBoundary } from "@/components/ui/DataBoundary";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/States";
import type { ResearchMeta } from "@/types";

function MetaRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand"><Icon className="h-4.5 w-4.5" /></span>
      <div>
        <div className="text-xs font-medium text-muted">{label}</div>
        <div className="text-sm font-medium text-fg">{value}</div>
      </div>
    </div>
  );
}

export default function About() {
  const state = useJsonData<ResearchMeta>("research.json");
  return (
    <>
      <SectionHeading eyebrow="Info" title="Tentang Penelitian" description="Informasi lengkap mengenai skripsi dan metodologi yang mendasari dashboard ini." />
      <DataBoundary state={state} skeleton={<div className="space-y-4"><Skeleton className="h-40" /><Skeleton className="h-48" /></div>}>
        {(r) => (
          <div className="space-y-6">
            {/* Judul */}
            <Card delay={0} className="bg-gradient-to-br from-brand/[0.07] to-transparent">
              <span className="chip bg-brand/10 text-brand"><GraduationCap className="h-3.5 w-3.5" /> Skripsi · {r.year}</span>
              <h2 className="mt-3 font-display text-xl font-bold leading-snug text-fg sm:text-2xl">{r.title}</h2>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card delay={0.05}>
                <CardHeader title="Identitas" />
                <div className="divide-y divide-border">
                  <MetaRow icon={User} label="Peneliti" value={r.researcher + (r.student_id ? ` · ${r.student_id}` : "")} />
                  {r.advisor && <MetaRow icon={User} label="Dosen Pembimbing" value={r.advisor} />}
                  <MetaRow icon={Building2} label="Universitas" value={r.university} />
                  {r.program && <MetaRow icon={GraduationCap} label="Program Studi" value={r.program + (r.faculty ? ` — ${r.faculty}` : "")} />}
                </div>
              </Card>

              <Card delay={0.1}>
                <CardHeader title="Metodologi" />
                <div className="divide-y divide-border">
                  <MetaRow icon={FlaskConical} label="Metode Penelitian" value={r.method} />
                  <MetaRow icon={Trees} label="Algoritma" value={r.algorithm} />
                  <MetaRow icon={Sparkles} label="Explainable AI" value={r.xai} />
                  <MetaRow icon={Database} label="Sumber Dataset" value={r.dataset_source} />
                </div>
              </Card>
            </div>

            {/* Diagram alur */}
            <Card delay={0.1}>
              <CardHeader title="Alur Penelitian" subtitle="Tahapan proses dari pengumpulan data hingga strategi retensi" />
              <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
                {r.flow.map((step, i) => (
                  <div key={i} className="flex flex-1 items-center gap-3 lg:flex-col lg:items-stretch">
                    <motion.div
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className="flex-1 rounded-xl border border-border bg-surface-2/50 p-4"
                    >
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm font-bold text-brand-fg">{i + 1}</div>
                      <div className="mt-2.5 font-display text-sm font-semibold text-fg">{step.step}</div>
                      <div className="mt-1 text-xs leading-relaxed text-muted">{step.detail}</div>
                    </motion.div>
                    {i < r.flow.length - 1 && (
                      <ArrowRight className="h-5 w-5 shrink-0 rotate-90 text-muted lg:rotate-0" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </DataBoundary>
    </>
  );
}
