import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Konfigurasi Vite. Alias "@" menunjuk ke folder src agar import lebih rapi.
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: { "@": path.resolve(__dirname, "./src") },
    },
    build: {
        chunkSizeWarningLimit: 1600, // Plotly berukuran besar, naikkan ambang peringatan.
    },
});
