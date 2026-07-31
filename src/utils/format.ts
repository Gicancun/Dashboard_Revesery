// Kumpulan helper format angka & warna yang dipakai lintas komponen.

/** Format angka dengan pemisah ribuan gaya Indonesia (1.234.567). */
export const nf = (n: number): string => new Intl.NumberFormat("id-ID").format(n);

/** Format persen dari nilai 0..1 → "12,3%". */
export const pct = (v: number, digits = 1): string =>
  `${(v * 100).toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;

/** Format skor 0..1 menjadi 3 desimal ("0.842"). */
export const score = (v: number): string => v.toFixed(3);

/** Potong teks panjang agar rapi di label chart. */
export const truncate = (s: string, max = 22): string =>
  s.length > max ? `${s.slice(0, max - 1)}…` : s;

/** Interpolasi warna churn(merah) → retain(hijau) untuk skala SHAP. */
export const shapColor = (t: number): string => {
  const c = Math.max(0, Math.min(1, t));
  const r = Math.round(59 + (239 - 59) * c);
  const g = Math.round(130 + (68 - 130) * c);
  const b = Math.round(246 + (68 - 246) * c);
  return `rgb(${r}, ${g}, ${b})`;
};
