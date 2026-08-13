// Membaca token warna dari CSS variable agar Chart.js ikut berganti saat
// light/dark mode berubah. Dipicu ulang setiap kali `theme` berubah.
import { useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";

const readVar = (name: string): string => {
  if (typeof window === "undefined") return "0 0 0";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};
const rgb = (name: string, a = 1): string => {
  const v = readVar(name) || "0 0 0";
  return `rgb(${v} / ${a})`;
};

export function useChartTheme() {
  const { theme } = useTheme();
  // theme sengaja dijadikan dependency agar warna dihitung ulang saat toggle.
  return useMemo(
    () => ({
      brand: rgb("--brand"),
      brandFill: rgb("--brand", 0.14),
      info: rgb("--info"),
      infoFill: rgb("--info", 0.14),
      infoDark: rgb("--info-dark"),
      accent: rgb("--accent"),
      churn: rgb("--churn"),
      churnFill: rgb("--churn", 0.14),
      retain: rgb("--retain"),
      retainFill: rgb("--retain", 0.14),
      warn: rgb("--warn"),
      grid: rgb("--border", 0.6),
      text: rgb("--muted"),
      fg: rgb("--fg"),
      surface: rgb("--surface"),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme],
  );
}
