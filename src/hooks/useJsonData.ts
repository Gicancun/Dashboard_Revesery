// Hook generik untuk memuat file JSON dari /public/data.
// Mengembalikan status loading/error sehingga UI bisa menampilkan skeleton.
import { useEffect, useState } from "react";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * @param file nama file di dalam /public/data, mis. "metrics.json"
 * Ganti isi file JSON kapan pun tanpa mengubah komponen — cukup reload.
 */
export function useJsonData<T>(file: string): State<T> {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let alive = true;
    setState({ data: null, loading: true, error: null });
    // import.meta.env.BASE_URL menjaga path benar saat di-deploy ke subfolder.
    fetch(`${import.meta.env.BASE_URL}data/${file}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Gagal memuat ${file} (HTTP ${r.status})`);
        return r.json();
      })
      .then((json: T) => alive && setState({ data: json, loading: false, error: null }))
      .catch((e: Error) => alive && setState({ data: null, loading: false, error: e.message }));
    return () => {
      alive = false;
    };
  }, [file]);

  return state;
}
