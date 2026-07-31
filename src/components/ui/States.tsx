// Komponen status: skeleton loading, error, dan empty state.
import { AlertTriangle, Inbox } from "lucide-react";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

/** Skeleton untuk area chart. */
export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return <div className="skeleton w-full rounded-xl" style={{ height }} />;
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-2 p-8 text-center">
      <AlertTriangle className="h-8 w-8 text-churn" />
      <p className="font-medium text-fg">Data tidak dapat dimuat</p>
      <p className="max-w-md text-sm text-muted">{message}</p>
      <p className="mt-1 text-xs text-muted">
        Pastikan file JSON tersedia di <code className="font-mono">/public/data/</code>.
      </p>
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
