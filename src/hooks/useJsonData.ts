/**
 * useApiData — fetch data dari backend FastAPI HANYA (tanpa fallback dummy).
 *
 * Semua endpoint /api/* backend mengembalikan error dalam bentuk standar FastAPI
 * HTTPException: { "detail": "<pesan spesifik & actionable>" }. Hook ini SELALU
 * membaca `detail` itu dan menampilkannya apa adanya ke UI — pesan generik hanya
 * dipakai kalau fetch gagal total sebelum sempat dapat response (network putus,
 * CORS, backend down), karena di situ tidak ada body untuk dibaca.
 *
 * Status 503 diperlakukan sebagai kondisi non-error ("belum ada data" atau
 * "pipeline masih training") — lihat DataBoundary untuk bagaimana ini dibedakan
 * secara visual dari error sungguhan (422/500/dst).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { apiUrl, readErrorDetail, GENERIC_UNREACHABLE_MESSAGE } from "@/utils/api";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** true jika sedang menunggu pipeline backend selesai (bukan error) */
  waiting: boolean;
  /** true jika sempat dapat response dari backend (live), baik sukses maupun error */
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
    // Reset error/waiting begitu fetch baru dimulai — supaya banner error basi
    // tidak nyangkut bersamaan dengan state baru (mis. saat refetch dipicu upload).
    setState((s) => ({ ...s, loading: true, error: null, waiting: false, noDataYet: false }));

    let res: Response;
    try {
      res = await fetch(apiUrl(apiEndpoint));
    } catch {
      // Fetch reject sebelum dapat response sama sekali — satu-satunya kasus valid
      // untuk pesan generik, karena tidak ada body `detail` yang bisa dibaca.
      if (alive.current) {
        setState({ data: null, loading: false, error: GENERIC_UNREACHABLE_MESSAGE, waiting: false, isLive: false, noDataYet: false });
      }
      return;
    }

    if (res.status === 503) {
      // Bukan error fatal: backend hidup tapi belum ada data, atau pipeline masih training.
      const detail = await readErrorDetail(res);
      if (detail && /belum ada data/i.test(detail)) {
        if (alive.current) {
          setState({ data: null, loading: false, error: null, waiting: false, isLive: true, noDataYet: true });
        }
        return;
      }
      // Pipeline masih berjalan, retry setelah 3 detik.
      if (alive.current) {
        setState((s) => ({ ...s, loading: false, waiting: true, noDataYet: false, isLive: true }));
        retryTimer.current = setTimeout(fetchData, 3000);
      }
      return;
    }

    if (!res.ok) {
      // Error sungguhan (422/500/409/400/413/401/dst). Backend selalu kirim `detail`
      // yang sudah actionable — tampilkan itu, bukan pesan generik.
      const detail = await readErrorDetail(res);
      if (alive.current) {
        setState({
          data: null,
          loading: false,
          error: detail ?? `Server mengembalikan error (HTTP ${res.status}) tanpa detail.`,
          waiting: false,
          isLive: true,
          noDataYet: false,
        });
      }
      return;
    }

    try {
      const json: T = await res.json();
      if (alive.current) {
        setState({ data: json, loading: false, error: null, waiting: false, isLive: true, noDataYet: false });
      }
    } catch {
      if (alive.current) {
        setState({
          data: null,
          loading: false,
          error: "Respons backend tidak valid (bukan JSON).",
          waiting: false,
          isLive: true,
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
