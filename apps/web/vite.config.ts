import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The production build ships only the app (index.html). The headless render
// harness (harness.html) is test-only — Vite's dev server serves it by path
// during the Playwright golden-frame/export-smoke runs, so it never bloats the
// deployed bundle.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    target: "es2022",
  },
  worker: {
    format: "es",
  },
});
