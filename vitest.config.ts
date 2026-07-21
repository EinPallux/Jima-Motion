import { defineConfig } from "vitest/config";

// Unit tests run in Node (pure logic: timeline math, easings, springs, RNG,
// layout, capability parsing). Browser-dependent rendering is covered by the
// Playwright golden-frame + export-smoke suites (`pnpm test:golden`).
export default defineConfig({
  test: {
    include: ["packages/**/*.test.ts"],
    environment: "node",
    passWithNoTests: false,
  },
});
