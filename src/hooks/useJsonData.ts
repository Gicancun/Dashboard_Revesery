/**
 * useApiData — fetch data dari backend FastAPI HANYA (tanpa fallback dummy).
 */
import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** true jika sedang menunggu pipeline backend selesai */
  waiting: boolean;
  /** true jika terhubung ke backend live */
  isLive: boolean;
  /** true jika belum ada data yang diupload di backend */
  noDataYet: boolean;
}

export function useApiData<T>(endpoint: string): State<T> & { refetch: () => void } {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: true,
    error: null,
    waiting: false,
    isLive: false,
    noDataYet: false,
  });

  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);

  const apiEndpoint = endpoint.replace(/\.json$/, "");

  const fetchData = useCallback(async () => {
    if (!alive.current) return;
    setState((s) => ({ ...s, loading: true, error: null, waiting: false, noDataYet: false }));

    try {
      const url = `${API_BASE.replace(/\/$/, "")}/${apiEndpoint}`;
      const res = await fetch(url);

      if (res.status === 503) {
        const body = await res.json().catch(() => ({ detail: "" }));
        if (body.detail && body.detail.includes("Belum ada data")) {
          if (alive.current) {
            setState({ data: null, loading: false, error: null, waiting: false, isLive: true, noDataYet: true });
          }
          return;
        }
        // Pipeline masih berjalan, retry setelah 3 detik
        if (alive.current) {
          setState((s) => ({ ...s, loading: false, waiting: true, noDataYet: false }));
          retryTimer.current = setTimeout(fetchData, 3000);
        }
        return;
      }

      if (!res.ok) {
        throw new Error(`Gagal terhubung ke Backend FastAPI (HTTP ${res.status}). Pastikan backend berjalan.`);
      }

      const json: T = await res.json();
      if (alive.current) {
        setState({ data: json, loading: false, error: null, waiting: false, isLive: true, noDataYet: false });
      }
    } catch (e) {
      if (alive.current) {
        setState({
          data: null,
          loading: false,
          error: (e as Error).message,
          waiting: false,
          isLive: false,
          noDataYet: false,
        });
      }
    }
  }, [apiEndpoint]);

  useEffect(() => {
    alive.current = true;
    fetchData();
    return () => {
      alive.current = false;
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

/** Backward-compat alias */
export { useApiData as useJsonData };

