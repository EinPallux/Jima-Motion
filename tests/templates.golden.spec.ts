import { test, expect, type Page } from "@playwright/test";
import type { Aspect } from "@jima/engine";

// Data-driven golden-frame + determinism suite over the whole template library.
// Determinism proof: pixel-exact re-seek (the timeline + update(t) are pure in
// t). Screenshot baselines guard against visual regressions.

interface T {
  id: string;
  palette: string;
  poster: number;
  duration: number;
}

const TEMPLATES: T[] = [
  { id: "kinetic-headline", palette: "ink-white", poster: 3.2, duration: 4.0 },
  { id: "slide-reveal", palette: "editorial-ink", poster: 2.6, duration: 4.5 },
  { id: "glow-promo", palette: "tangerine", poster: 2.2, duration: 5.0 },
  { id: "product-pop", palette: "studio-white", poster: 3.0, duration: 5.0 },
  { id: "typewriter", palette: "paper-terminal", poster: 2.2, duration: 3.735 },
  { id: "ken-burns", palette: "neutral", poster: 2.0, duration: 6.0 },
  { id: "big-number", palette: "ink", poster: 2.6, duration: 4.5 },
  { id: "quote-spotlight", palette: "paper-ink", poster: 3.5, duration: 6.0 },
  { id: "logo-sting", palette: "white-ink", poster: 1.6, duration: 3.5 },
  { id: "save-the-date", palette: "ivory", poster: 3.0, duration: 5.0 },
  { id: "tips-stack", palette: "notebook", poster: 3.6, duration: 5.4 },
  { id: "split-duo", palette: "coral-cobalt", poster: 1.8, duration: 5.0 },
];

const ASPECTS: Aspect[] = ["1:1", "4:5", "9:16", "16:9"];
const FRACTIONS = [0, 0.25, 0.5, 0.75, 1];

async function load(page: Page, id: string, aspect: Aspect, palette: string, res = 0.4) {
  await page.goto(`/harness.html?template=${id}&aspect=${aspect}&t=0&res=${res}&palette=${palette}`);
  await page.waitForFunction(() => window.__jimaHarnessReady === true, undefined, { timeout: 20000 });
  const err = await page.evaluate(() => window.__jimaError);
  if (err) throw new Error(`harness error: ${err}`);
}

async function frameAt(page: Page, t: number): Promise<string> {
  return page.evaluate((time) => {
    window.__jima!.renderAt(time);
    return window.__jima!.canvas.toDataURL("image/png");
  }, t);
}

test.describe("determinism (re-seek is pixel-exact)", () => {
  for (const tpl of TEMPLATES) {
    test(`${tpl.id}`, async ({ page }) => {
      await load(page, tpl.id, "1:1", tpl.palette);
      const duration = await page.evaluate(() => window.__jima!.duration);
      expect(duration).toBeCloseTo(tpl.duration, 1);
      for (const frac of FRACTIONS) {
        const t = frac * duration;
        const first = await frameAt(page, t);
        await frameAt(page, t === 0 ? duration : 0);
        await frameAt(page, t * 0.41 + 0.17);
        const second = await frameAt(page, t);
        expect(second, `${tpl.id} @ t=${t}s must be identical after re-seek`).toBe(first);
      }
    });
  }
});

test.describe("poster frames", () => {
  for (const tpl of TEMPLATES) {
    for (const aspect of ASPECTS) {
      test(`${tpl.id} — ${aspect}`, async ({ page }) => {
        await load(page, tpl.id, aspect, tpl.palette);
        await frameAt(page, tpl.poster);
        await expect(page.locator("#jima-canvas")).toHaveScreenshot(
          `${tpl.id}-${aspect.replace(":", "x")}.png`,
          { maxDiffPixelRatio: 0.02 },
        );
      });
    }
  }
});
