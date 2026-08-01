import type { ReactNode } from "react";
import { ErrorState } from "./States";
import { Loader2, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";

/** Menyeragamkan penanganan loading/error/waiting/noDataYet untuk data dari useApiData. */
export function DataBoundary<T>({
  state, skeleton, children,
}: {
  state: { data: T | null; loading: boolean; error: string | null; waiting?: boolean; noDataYet?: boolean };
  skeleton: ReactNode;
  children: (data: T) => ReactNode;
}) {
  if (state.noDataYet) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-brand/30 bg-surface-2/40 p-12 text-center backdrop-blur-md">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand/15 border border-brand/30 text-brand-soft">
          <UploadCloud className="h-8 w-8" />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-fg">Belum Ada Data Dihitung</h3>
        <p className="mt-2 max-w-md text-sm text-muted">
          Backend FastAPI siap memproses data Anda. Silakan unggah file <code>Transaction_Revesery.xlsx</code> untuk mulai melatih model Machine Learning dan melihat dashboard.
        </p>
        <Link
          to="/dataset"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
        >
          <UploadCloud className="h-4 w-4" /> Unggah Dataset Excel Now
        </Link>
      </div>
    );
  }
  if (state.waiting) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-brand/20 bg-surface/50 p-12 text-center backdrop-blur-md">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
        <h3 className="mt-4 font-display text-lg font-bold text-fg">Memproses Model ML & Pipeline...</h3>
        <p className="mt-1 max-w-md text-sm text-muted">
          Backend FastAPI sedang membersihkan data, melatih Random Forest, dan mengkalkulasi SHAP values. Halaman akan otomatis diperbarui.
        </p>
      </div>
    );
  }
  if (state.loading) return <>{skeleton}</>;
  if (state.error || !state.data) return <ErrorState message={state.error ?? "Data kosong."} />;
  return <>{children(state.data)}</>;
}


