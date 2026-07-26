import { test, expect, type Page } from "@playwright/test";
import type { SoundPack } from "@jima/engine";

// The sound layer's quality gate. Cue *selection* is unit-tested in Node
// (packages/engine/src/audio/*.test.ts); this bakes the real Web Audio graph in
// a real browser and measures what comes out, which is the only place a claim
// like "it doesn't clip" can actually be checked.

async function load(page: Page, template: string, aspect = "16:9"): Promise<void> {
  await page.goto(`/harness.html?template=${template}&aspect=${encodeURIComponent(aspect)}&res=0.2&t=0`);
  await page.waitForFunction(() => window.__jimaHarnessReady === true, undefined, { timeout: 30000 });
  const err = await page.evaluate(() => window.__jimaError);
  if (err) throw new Error(`harness error: ${err}`);
}

const measure = (page: Page, pack?: SoundPack) => page.evaluate((p) => window.__jima!.audio(p), pack);

// One per sound profile, so every branch of the vocabulary gets baked.
const CASES: { template: string; aspect: string; profile: string }[] = [
  { template: "voice-note", aspect: "9:16", profile: "ui" },
  { template: "drop-letters", aspect: "16:9", profile: "type" },
  { template: "product-pop", aspect: "1:1", profile: "impact" },
  { template: "donut-chart", aspect: "1:1", profile: "data" },
  { template: "photo-mosaic", aspect: "1:1", profile: "airy" },
  { template: "logo-sting", aspect: "16:9", profile: "warm" },
  { template: "shatter-intro", aspect: "16:9", profile: "cinematic" },
];

test.describe("baked sound", () => {
  for (const { template, aspect, profile } of CASES) {
    test(`${template} bakes clean audio in the ${profile} profile`, async ({ page }) => {
      await load(page, template, aspect);
      const stats = await measure(page);
      expect(stats, "OfflineAudioContext should be available in Chromium").not.toBeNull();

      expect(stats!.profile).toBe(profile);
      expect(stats!.cues).toBeGreaterThan(0);
      // Density: enough to feel scored, never a machine gun.
      expect(stats!.cues).toBeLessThanOrEqual(40);

      // Headroom. Anything at or above 1.0 is a clipped export.
      expect(stats!.peak).toBeGreaterThan(0.05);
      expect(stats!.peak).toBeLessThan(0.95);

      // Actually audible, and actually sparse — a wall of sound over a 4s
      // animation would be as wrong as silence.
      expect(stats!.rms).toBeGreaterThan(0.002);
      expect(stats!.silentFraction).toBeGreaterThan(0.1);
      expect(stats!.silentFraction).toBeLessThan(0.95);
    });
  }

  test("every pack is audible and clean on the same template", async ({ page }) => {
    await load(page, "donut-chart", "1:1");
    for (const pack of ["pop", "soft", "retro"] as SoundPack[]) {
      const stats = await measure(page, pack);
      expect(stats, pack).not.toBeNull();
      expect(stats!.peak, pack).toBeGreaterThan(0.05);
      expect(stats!.peak, pack).toBeLessThan(0.95);
      expect(stats!.rms, pack).toBeGreaterThan(0.002);
    }
  });

  test("the bake is deterministic", async ({ page }) => {
    await load(page, "product-pop", "1:1");
    const a = await measure(page);
    const b = await measure(page);
    expect(a!.peak).toBeCloseTo(b!.peak, 6);
    expect(a!.rms).toBeCloseTo(b!.rms, 6);
  });

  test("the track leaves room for the tail after the animation ends", async ({ page }) => {
    await load(page, "logo-sting", "16:9");
    const stats = await measure(page);
    const duration = await page.evaluate(() => window.__jima!.duration);
    // A bell in a room rings for over a second; truncating it clicks.
    expect(stats!.seconds).toBeGreaterThan(duration);
    expect(stats!.seconds).toBeLessThan(duration + 2.5);
  });
});
