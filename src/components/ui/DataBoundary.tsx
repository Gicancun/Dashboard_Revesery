import type { ReactNode } from "react";
import { ErrorState } from "./States";

/** Menyeragamkan penanganan loading/error untuk data dari useJsonData. */
export function DataBoundary<T>({
  state, skeleton, children,
}: {
  state: { data: T | null; loading: boolean; error: string | null };
  skeleton: ReactNode;
  children: (data: T) => ReactNode;
}) {
  if (state.loading) return <>{skeleton}</>;
  if (state.error || !state.data) return <ErrorState message={state.error ?? "Data kosong."} />;
  return <>{children(state.data)}</>;
}
