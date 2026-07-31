// Kotak "Interpretasi Akademik" di bawah visualisasi — memberi narasi ilmiah.
import { BookOpen } from "lucide-react";
import type { ReactNode } from "react";

export function AcademicNote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex gap-3 rounded-xl border border-border bg-surface-2/60 p-4">
      <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
      <div className="text-sm leading-relaxed text-muted">
        <span className="font-medium text-fg">Interpretasi akademik. </span>
        {children}
      </div>
    </div>
  );
}
