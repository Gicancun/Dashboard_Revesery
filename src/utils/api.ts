/**
 * Util bersama untuk komunikasi dengan Revesery Churn API (FastAPI).
 * Menyeragamkan base URL dan cara membaca error di seluruh halaman, supaya
 * pesan `detail` dari HTTPException backend selalu ditampilkan ke user —
 * bukan pesan generik hardcoded.
 */

export const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:8000/api").replace(/\/$/, "");

/** Bangun URL lengkap ke satu endpoint /api/*, terlepas dari leading/trailing slash. */
export function apiUrl(path: string): string {
  return `${API_BASE}/${path.replace(/^\//, "")}`;
}

/** Fallback SATU-SATUNYA kasus network gagal total (belum sempat dapat response sama sekali). */
export const GENERIC_UNREACHABLE_MESSAGE = "Gagal terhubung ke Backend FastAPI. Pastikan backend berjalan.";

/**
 * Ambil field `detail` dari body JSON response FastAPI (HTTPException: { "detail": "..." }).
 * Mengembalikan null kalau body bukan JSON valid atau tidak punya `detail` yang bisa dibaca —
 * caller lalu pakai fallback generik.
 */
export async function readErrorDetail(res: Response): Promise<string | null> {
  try {
    const body = await res.json();
    if (body && typeof body.detail === "string" && body.detail.trim()) return body.detail;
  } catch {
    // Body kosong / bukan JSON (mis. error dari proxy, bukan dari FastAPI) — biarkan null.
  }
  return null;
}
