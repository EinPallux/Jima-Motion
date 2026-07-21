import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Multi-page: the app itself, plus a headless render harness used by the
// golden-frame and export-smoke Playwright tests (kept out of the app bundle).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        harness: resolve(import.meta.dirname, "harness.html"),
      },
    },
  },
  worker: {
    format: "es",
  },
});
