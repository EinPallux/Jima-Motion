import { test, expect, type Page } from "@playwright/test";
import type { Aspect } from "@jima/engine";

// Phase 1 golden-frame + determinism suite for T01 Kinetic Headline.
//
// The hard determinism proof is pixel-exact re-seek equality (below): the
// timeline is stateless, so asking for the same t always paints identical
// pixels regardless of what was rendered in between. Screenshot baselines are a
// secondary visual-regression guard (small tolerance absorbs cross-GPU AA).

const ASPECTS: Aspect[] = ["1:1", "4:5", "9:16", "16:9"];
const FRACTIONS = [0, 0.25, 0.5, 0.75, 1]; // × 4.0s duration → 0,1,2,3,4s

async function load(page: Page, aspect: Aspect, res = 0.4) {
  await page.goto(
    `/harness.html?template=kinetic-headline&aspect=${aspect}&t=0&res=${res}&palette=ink-white`,
  );
  await page.waitForFunction(() => window.__jimaHarnessReady === true, undefined, { timeout: 20000 });
  const err = await page.evaluate(() => window.__jimaError);
  if (err) throw new Error(`harness error: ${err}`);
}

// Render at t and return the canvas as a PNG data URL (byte-identical for
// identical pixels).
async function frameAt(page: Page, t: number): Promise<string> {
  return page.evaluate((time) => {
    window.__jima!.renderAt(time);
    return window.__jima!.canvas.toDataURL("image/png");
  }, t);
}

test.describe("T01 determinism", () => {
  for (const aspect of ASPECTS) {
    test(`re-seek is pixel-exact — ${aspect}`, async ({ page }) => {
      await load(page, aspect);
      const duration = await page.evaluate(() => window.__jima!.duration);
      expect(duration).toBeCloseTo(4.0, 5);

      for (const frac of FRACTIONS) {
        const t = frac * duration;
        const first = await frameAt(page, t);
        // Disturb state by seeking elsewhere, then return.
        await frameAt(page, t === 0 ? duration : 0);
        await frameAt(page, t * 0.37 + 0.13);
        const second = await frameAt(page, t);
        expect(second, `frame at t=${t}s must be identical after re-seek`).toBe(first);
      }
    });
  }

  test("fresh instances render identically (cross-build determinism)", async ({ page }) => {
    await load(page, "1:1");
    const a = await frameAt(page, 2.0);
    // Reload → brand new renderer/context/timeline, same inputs.
    await load(page, "1:1");
    const b = await frameAt(page, 2.0);
    expect(b).toBe(a);
  });
});

test.describe("T01 golden frames", () => {
  for (const aspect of ASPECTS) {
    test(`poster frame — ${aspect}`, async ({ page }) => {
      await load(page, aspect);
      await frameAt(page, 3.2); // posterTime
      await expect(page.locator("#jima-canvas")).toHaveScreenshot(`t01-${aspect.replace(":", "x")}.png`, {
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});
