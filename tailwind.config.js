/** @type {import('tailwindcss').Config} */
// Palet warna dipetakan ke CSS variable (lihat src/index.css) sehingga rebrand
// cukup dilakukan di satu tempat. `<alpha-value>` menjaga dukungan opacity Tailwind.
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          soft: "rgb(var(--brand-soft) / <alpha-value>)",
          fg: "rgb(var(--brand-fg) / <alpha-value>)",
        },
        accent: "rgb(var(--accent) / <alpha-value>)",
        churn: "rgb(var(--churn) / <alpha-value>)",
        retain: "rgb(var(--retain) / <alpha-value>)",
        warn: "rgb(var(--warn) / <alpha-value>)",
        // Token permukaan/teks yang otomatis menyesuaikan light & dark mode.
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        // Flat design — border tipis adalah pemisah utama, shadow hanya jejak sangat halus.
        card: "0 1px 2px rgb(15 23 42 / 0.03)",
        "card-hover": "0 1px 2px rgb(15 23 42 / 0.05)",
      },
      borderRadius: { xl: "0.9rem", "2xl": "1.15rem" },
      spacing: { 4.5: "1.125rem" }, // dipakai untuk ukuran ikon 18px (h-4.5/w-4.5)
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: { shimmer: "shimmer 1.6s infinite" },
    },
  },
  plugins: [],
};
