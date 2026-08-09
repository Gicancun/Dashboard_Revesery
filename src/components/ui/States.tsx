// Komponen status: skeleton loading, error, dan empty state.
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

/** Skeleton untuk area chart. */
export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return <div className="skeleton w-full rounded-xl" style={{ height }} />;
}

/** Pesan berasal dari `detail` HTTPException backend — sudah spesifik & actionable, tampilkan apa adanya. */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-2 p-8 text-center">
      <AlertTriangle className="h-8 w-8 text-churn" />
      <p className="font-medium text-fg">Data tidak dapat dimuat</p>
      <p className="max-w-md text-sm leading-relaxed text-muted">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2/60 px-4 py-2 text-sm font-semibold text-fg transition-colors hover:border-brand/40 hover:text-brand-soft"
        >
          <RefreshCw className="h-4 w-4" /> Coba Lagi
        </button>
      )}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted">
      <Inbox className="h-8 w-8" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
