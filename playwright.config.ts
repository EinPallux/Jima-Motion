import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

// Use the environment's pre-installed Chromium when present (its build may not
// match this Playwright version's bundled download). CI installs its own, so
// there this resolves to undefined and Playwright uses the bundled browser.
const preinstalledChromium = process.env.PLAYWRIGHT_BROWSERS_PATH
  ? `${process.env.PLAYWRIGHT_BROWSERS_PATH}/chromium`
  : undefined;
const chromiumExecutable =
  preinstalledChromium && existsSync(preinstalledChromium) ? preinstalledChromium : undefined;

// Golden-frame + export-smoke tests drive the headless render harness
// (apps/web/harness.html) in real browsers. WebGL is enabled via SwiftShader
// so Pixi renders deterministically in CI headless Chromium.
const PORT = 5178;

const swiftshaderArgs = [
  "--use-gl=angle",
  "--use-angle=swiftshader",
  "--enable-unsafe-swiftshader",
  "--ignore-gpu-blocklist",
];

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // WebGL runs on SwiftShader (software) here, so a Studio end-to-end flow —
  // spin up a preview context, render, export a real GIF — is CPU-bound and can
  // take a while when workers overlap. 60s gives these heavy flows headroom; the
  // fast golden/harness renders still finish in seconds.
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: swiftshaderArgs,
          ...(chromiumExecutable ? { executablePath: chromiumExecutable } : {}),
        },
      },
    },
  ],
  webServer: {
    command: `pnpm --filter @jima/web exec vite --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
