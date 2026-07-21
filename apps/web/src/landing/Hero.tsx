import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "../studio/hooks/useReducedMotion";
import { hasWebGL2 } from "../studio/CapabilityFloor";

const HeroBackground = lazy(() => import("./hero/HeroBackground"));
const LiveTemplate = lazy(() => import("./LiveTemplate").then((m) => ({ default: m.LiveTemplate })));

const CHIPS = ["100% free", "No account", "No watermark", "Private by design"];

export function Hero() {
  const reduced = useReducedMotion();
  const webgl = hasWebGL2();
  const showWebGL = webgl && !reduced;

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background: WebGL gradient, or a static CSS gradient fallback. */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        {showWebGL ? (
          <Suspense fallback={<StaticGradient />}>
            <HeroBackground animate />
          </Suspense>
        ) : (
          <StaticGradient />
        )}
      </div>

      <div className="mx-auto grid min-h-[100dvh] max-w-6xl grid-cols-1 items-center gap-10 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="max-w-xl">
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Motion graphics for social media. <span className="text-ember">In seconds.</span>
          </h1>
          <p className="mt-6 text-lg text-ink/75 sm:text-xl">
            Pick a template, type your words, drop in your images — export an MP4 or GIF. 100% free,
            no account, no watermark. Nothing you make ever leaves your browser.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/studio"
              className="rounded-[14px] bg-ember px-7 py-3.5 text-lg font-semibold text-ink shadow-[var(--shadow-pop)] transition-transform hover:scale-[1.03] active:scale-100"
            >
              Open the Studio
            </Link>
            <a
              href="#templates"
              className="rounded-[14px] border border-ink/15 bg-paper/70 px-6 py-3.5 text-lg font-semibold text-ink backdrop-blur transition-colors hover:bg-paper"
            >
              Browse templates
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-ink/70">
            {CHIPS.map((c) => (
              <li key={c} className="flex items-center gap-1.5">
                <span className="text-ember" aria-hidden>
                  ✦
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* The site demos its own engine. */}
        <div className="mx-auto w-full max-w-sm">
          <div className="overflow-hidden rounded-[24px] bg-paper shadow-[var(--shadow-pop)] ring-1 ring-ink/5">
            <Suspense fallback={<div className="aspect-square w-full bg-porcelain" />}>
              <LiveTemplate
                templateId="kinetic-headline"
                aspect="1:1"
                paletteId="ink-white"
                values={{ headline: "Say it with motion.", subline: "Made in Jima Studio", style: "pop" }}
                play={!reduced}
                className="w-full"
              />
            </Suspense>
          </div>
          <p className="mt-3 text-center text-sm text-ink/55">Every animation here is a live Jima template.</p>
        </div>
      </div>
    </section>
  );
}

function StaticGradient() {
  return (
    <div
      className="h-full w-full"
      style={{
        background:
          "radial-gradient(60% 55% at 25% 30%, #FFE3D6 0%, rgba(255,255,255,0) 60%)," +
          "radial-gradient(55% 50% at 80% 25%, #F1E4FF 0%, rgba(255,255,255,0) 60%)," +
          "radial-gradient(60% 60% at 70% 85%, #DAF3FF 0%, rgba(255,255,255,0) 60%)," +
          "radial-gradient(50% 50% at 20% 80%, #FFE0F0 0%, rgba(255,255,255,0) 60%), #ffffff",
      }}
    />
  );
}
