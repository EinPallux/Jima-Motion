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
  // Expansion pack (v1.1) — 23 new templates.
  { id: "icon-pop", palette: "punch", poster: 1.4, duration: 3.4 },
  { id: "subscribe-bell", palette: "light", poster: 2.4, duration: 3.6 },
  { id: "special-offer", palette: "ember", poster: 2.5, duration: 4.0 },
  { id: "kinetic-type", palette: "ink-white", poster: 2.6, duration: 3.8 },
  { id: "keynote-reveal", palette: "keynote-light", poster: 3.0, duration: 4.5 },
  { id: "word-swap", palette: "ink-ember", poster: 1.5, duration: 3.3 },
  { id: "marker-highlight", palette: "lime", poster: 2.8, duration: 4.0 },
  { id: "youtube-frame", palette: "light", poster: 2.6, duration: 4.0 },
  { id: "reel-frame", palette: "sunset-ember", poster: 2.6, duration: 4.5 },
  { id: "notification-pop", palette: "cloud", poster: 2.2, duration: 3.6 },
  { id: "like-spark", palette: "light", poster: 1.8, duration: 3.4 },
  { id: "tiktok-follow", palette: "light", poster: 2.0, duration: 3.4 },
  { id: "double-tap-heart", palette: "dark-rose", poster: 1.4, duration: 3.0 },
  { id: "comment-drop", palette: "light", poster: 3.0, duration: 4.3 },
  { id: "icon-grid", palette: "ember", poster: 2.2, duration: 3.6 },
  { id: "badge-stamp", palette: "ember", poster: 1.6, duration: 3.2 },
  { id: "folder-open", palette: "ember", poster: 2.4, duration: 4.5 },
  { id: "card-cascade", palette: "ember", poster: 2.8, duration: 3.95 },
  { id: "travel-postcard", palette: "sky", poster: 3.2, duration: 4.6 },
  { id: "location-pin", palette: "paper", poster: 2.2, duration: 3.4 },
  { id: "flash-sale", palette: "ember", poster: 2.4, duration: 4.0 },
  { id: "coupon-reveal", palette: "ember", poster: 2.6, duration: 4.0 },
  { id: "stat-bars", palette: "ink", poster: 3.2, duration: 3.8 },
  // Smooth-text pack (v1.2) — 20 kinetic-typography templates.
  { id: "fade-cascade", palette: "ink-white", poster: 2.6, duration: 3.2 },
  { id: "letter-reveal", palette: "ink-white", poster: 2.4, duration: 2.6 },
  { id: "line-rise", palette: "ink-white", poster: 2.6, duration: 3.0 },
  { id: "focus-in", palette: "ink-white", poster: 2.4, duration: 3.6 },
  { id: "side-slide", palette: "ink-white", poster: 2.6, duration: 3.6 },
  { id: "scale-in", palette: "ink-white", poster: 2.2, duration: 3.4 },
  { id: "flip-words", palette: "ink-white", poster: 2.4, duration: 3.4 },
  { id: "shine-text", palette: "ink-white", poster: 2.6, duration: 3.6 },
  { id: "split-reveal", palette: "ink-white", poster: 2.6, duration: 3.6 },
  { id: "wave-text", palette: "ink-white", poster: 1.5, duration: 2.9 },
  { id: "bounce-in", palette: "ink-white", poster: 2.2, duration: 3.4 },
  { id: "drop-letters", palette: "ink-white", poster: 2.2, duration: 2.8 },
  { id: "curtain-wipe", palette: "ink-white", poster: 2.6, duration: 3.4 },
  { id: "stacked-build", palette: "ink-white", poster: 2.8, duration: 3.7 },
  { id: "push-in", palette: "ink-white", poster: 2.6, duration: 3.6 },
  { id: "text-scramble", palette: "ink-white", poster: 2.4, duration: 2.8 },
  { id: "emphasis-line", palette: "ink-white", poster: 2.6, duration: 3.6 },
  { id: "spacing-expand", palette: "ink-white", poster: 2.4, duration: 3.4 },
  { id: "message-rotator", palette: "ink-white", poster: 1.6, duration: 4.8 },
  { id: "box-wipe", palette: "ink-white", poster: 2.6, duration: 3.6 },
  // Explainer / showcase / product / ad pack (v1.3).
  { id: "step-flow", palette: "ember", poster: 3.0, duration: 4.0 },
  { id: "timeline-flow", palette: "ember", poster: 2.8, duration: 3.7 },
  { id: "before-after", palette: "ember", poster: 3.2, duration: 4.0 },
  { id: "comparison-vs", palette: "ember", poster: 3.2, duration: 4.2 },
  { id: "feature-callouts", palette: "ember", poster: 3.2, duration: 3.9 },
  { id: "product-showcase", palette: "studio", poster: 3.0, duration: 4.0 },
  { id: "gallery-strip", palette: "ember", poster: 3.2, duration: 4.2 },
  { id: "feature-grid", palette: "ember", poster: 2.8, duration: 3.8 },
  { id: "device-mockup", palette: "ember", poster: 3.0, duration: 4.0 },
  { id: "review-stars", palette: "paper-ink", poster: 3.4, duration: 4.2 },
  { id: "product-hero", palette: "studio-white", poster: 3.0, duration: 4.0 },
  { id: "price-card", palette: "studio-white", poster: 3.2, duration: 4.0 },
  { id: "new-arrival", palette: "fresh-white", poster: 3.0, duration: 4.0 },
  { id: "spec-list", palette: "studio-white", poster: 3.2, duration: 4.0 },
  { id: "reveal-spotlight", palette: "spotlight-ink", poster: 3.4, duration: 4.2 },
  { id: "three-stats", palette: "ink", poster: 3.2, duration: 4.0 },
  { id: "logo-wall", palette: "ink", poster: 2.8, duration: 3.3 },
  { id: "countdown-timer", palette: "ember", poster: 3.0, duration: 4.5 },
  { id: "cta-endcard", palette: "ink", poster: 2.8, duration: 3.3 },
  { id: "sale-banner", palette: "ember", poster: 3.0, duration: 4.0 },
  // Showcase + product expansion (v1.4).
  { id: "photo-grid", palette: "ember", poster: 2.6, duration: 4.0 },
  { id: "polaroid-stack", palette: "sunset", poster: 2.8, duration: 3.6 },
  { id: "before-after-slider", palette: "studio", poster: 2.6, duration: 4.0 },
  { id: "carousel-cover", palette: "ember", poster: 2.6, duration: 3.8 },
  { id: "team-grid", palette: "paper", poster: 2.8, duration: 3.4 },
  { id: "testimonial-wall", palette: "ember", poster: 3.0, duration: 3.9 },
  { id: "feature-spotlight", palette: "ember", poster: 2.6, duration: 3.8 },
  { id: "image-reveal", palette: "ember", poster: 2.6, duration: 4.0 },
  { id: "split-showcase", palette: "ember", poster: 2.8, duration: 3.65 },
  { id: "mockup-tilt", palette: "ember", poster: 2.6, duration: 4.0 },
  { id: "product-carousel", palette: "studio-white", poster: 2.4, duration: 4.7 },
  { id: "product-360", palette: "studio", poster: 2.6, duration: 4.2 },
  { id: "color-variants", palette: "studio-white", poster: 2.8, duration: 4.0 },
  { id: "product-lineup", palette: "fresh-white", poster: 2.8, duration: 3.6 },
  { id: "bundle-offer", palette: "fresh-white", poster: 2.8, duration: 4.2 },
  { id: "product-detail", palette: "studio-white", poster: 3.0, duration: 4.0 },
  { id: "unbox-reveal", palette: "kraft", poster: 2.8, duration: 4.2 },
  { id: "size-compare", palette: "studio-white", poster: 3.0, duration: 4.0 },
  { id: "product-review", palette: "studio-white", poster: 3.0, duration: 4.2 },
  { id: "shop-grid", palette: "studio-white", poster: 2.8, duration: 3.6 },
  // v1.7 pack (50) — overlays, intros, loops, text, social, product/promo, stats, brand.
  { id: "lower-third", palette: "ink-white", poster: 2.6, duration: 4.5 },
  { id: "name-tag", palette: "cloud", poster: 2.2, duration: 4 },
  { id: "subtitle-bar", palette: "midnight-caption", poster: 2.8, duration: 4.5 },
  { id: "cta-bar", palette: "ink-white", poster: 2.4, duration: 4.2 },
  { id: "topic-bug", palette: "classic-live", poster: 2.4, duration: 4 },
  { id: "stat-callout", palette: "ink-white", poster: 2.6, duration: 4 },
  { id: "speech-pop", palette: "cloud", poster: 2.2, duration: 4 },
  { id: "channel-intro", palette: "midnight", poster: 2.6, duration: 4 },
  { id: "countdown-intro", palette: "ink", poster: 3.6, duration: 4.5 },
  { id: "logo-lines", palette: "ink", poster: 2.8, duration: 4.2 },
  { id: "neon-sign", palette: "midnight-pink", poster: 3.0, duration: 4 },
  { id: "clap-intro", palette: "classic-slate", poster: 3.0, duration: 4.2 },
  { id: "intro-bars", palette: "ink-trio", poster: 3.2, duration: 4 },
  { id: "highlight-sweep", palette: "lime", poster: 3.0, duration: 4.5 },
  { id: "outline-fill", palette: "ink-white", poster: 2.8, duration: 4.2 },
  { id: "stamp-text", palette: "ink-white", poster: 2.2, duration: 3.6 },
  { id: "rotating-headline", palette: "ink-white", poster: 4.2, duration: 4.992 },
  { id: "gradient-text", palette: "sunset", poster: 3.0, duration: 4.5 },
  { id: "split-flap", palette: "departure-navy", poster: 3.0, duration: 4.035 },
  { id: "underline-grow", palette: "ink-white", poster: 3.0, duration: 4.22 },
  { id: "story-poll", palette: "classic", poster: 3.2, duration: 4.2 },
  { id: "hashtag-pop", palette: "light", poster: 2.6, duration: 3.8 },
  { id: "followers-count", palette: "light", poster: 3.0, duration: 4 },
  { id: "swipe-up", palette: "midnight", poster: 2.4, duration: 4 },
  { id: "mention-tag", palette: "light", poster: 2.2, duration: 3.6 },
  { id: "sticker-pop", palette: "sun-pop", poster: 2.2, duration: 3.6 },
  { id: "discount-burst", palette: "ember", poster: 2.6, duration: 4 },
  { id: "new-drop", palette: "studio-white", poster: 3.0, duration: 4.5 },
  { id: "price-slash", palette: "ember", poster: 2.8, duration: 4 },
  { id: "feature-tags", palette: "studio-white", poster: 3.4, duration: 4.6 },
  { id: "limited-stock", palette: "ember", poster: 3.0, duration: 4.2 },
  { id: "shipping-badge", palette: "ember", poster: 2.6, duration: 3.8 },
  { id: "progress-ring", palette: "ink", poster: 3.0, duration: 4 },
  { id: "bar-race", palette: "ink", poster: 3.4, duration: 4.6 },
  { id: "percent-fill", palette: "citrus", poster: 3.0, duration: 4 },
  { id: "rating-bars", palette: "ink", poster: 3.2, duration: 4.4 },
  { id: "milestone-counter", palette: "ember", poster: 3.4, duration: 4.2 },
  { id: "quote-cards", palette: "studio-white", poster: 3.0, duration: 4.5 },
  { id: "logo-grid-reveal", palette: "paper", poster: 3.2, duration: 4.2 },
  { id: "testimonial-slide", palette: "paper-ink", poster: 3.0, duration: 4.5 },
  { id: "event-lineup", palette: "ivory", poster: 3.8, duration: 5 },
  { id: "thank-you", palette: "cream-ink", poster: 3.0, duration: 4.2 },
  { id: "logo-reveal-mask", palette: "ink-white", poster: 2.8, duration: 4 },
  { id: "end-screen", palette: "signal-red", poster: 3.2, duration: 4.5 },
  // Social expansion (v1.7.2).
  { id: "profile-card", palette: "light", poster: 3.4, duration: 4.6 },
  { id: "share-repost", palette: "light", poster: 2.8, duration: 4.0 },
  { id: "story-quiz", palette: "sunny", poster: 3.4, duration: 4.4 },
  { id: "qa-box", palette: "peach", poster: 3.0, duration: 4.2 },
  { id: "emoji-float", palette: "midnight", poster: 2.8, duration: 4.4 },
  { id: "dm-chat", palette: "daylight", poster: 3.6, duration: 4.6 },
  { id: "link-in-bio", palette: "ember", poster: 2.6, duration: 4.0 },
  { id: "verified-pop", palette: "sky", poster: 2.8, duration: 3.8 },
  { id: "giveaway", palette: "confetti", poster: 3.8, duration: 5.0 },
  { id: "trending-now", palette: "light", poster: 3.4, duration: 4.6 },
  // Reference-style pack (v1.8.1).
  { id: "comment-thread", palette: "daylight", poster: 3.8, duration: 5.0 },
  { id: "chat-convo", palette: "midnight", poster: 4.2, duration: 5.2 },
  { id: "search-type", palette: "noir-cyan", poster: 3.4, duration: 4.6 },
  { id: "retro-tv", palette: "crt-green", poster: 3.4, duration: 4.8 },
  { id: "watermark-drop", palette: "paper-light", poster: 3.0, duration: 4.4 },
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
