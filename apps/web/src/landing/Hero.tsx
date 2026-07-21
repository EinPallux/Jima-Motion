import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "../studio/hooks/useReducedMotion";
import { hasWebGL2 } from "../studio/CapabilityFloor";

const HeroBackground = lazy(() => import("./hero/HeroBackground"));

const CHIPS = ["100% free", "No account", "No watermark", "Private by design"];
const FORMATS = ["1:1", "4:5", "9:16", "16:9", "MP4", "WebM", "GIF"];

export function Hero() {
  const reduced = useReducedMotion();
  const showWebGL = hasWebGL2() && !reduced;

  return (
    <section className="px-3 pt-4 sm:px-5">
      <div className="relative mx-auto min-h-[80dvh] max-w-6xl overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,#F6F5FA_0%,#EFEEF5_45%,#F3EFEE_100%)] ring-1 ring-ink/5">
        {/* 3D platform + motion tile, or a static fallback. */}
        <div className="absolute inset-0" aria-hidden>
          {showWebGL ? (
            <Suspense fallback={null}>
              <HeroBackground animate />
            </Suspense>
          ) : (
            <StaticHero />
          )}
        </div>

        {/* Copy, left-aligned over the scene. */}
        <div className="relative z-10 flex min-h-[80dvh] flex-col justify-center px-7 py-16 sm:px-14">
          <div className="max-w-xl">
            <h1 className="font-display text-[2.7rem] font-bold leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Motion graphics for social media. <span className="text-ember">In seconds.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-ink/70">
              Pick a template, type your words, drop in your images — export an MP4 or GIF. 100% free,
              no account, no watermark. Nothing you make ever leaves your browser.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/studio"
                className="rounded-full bg-ink px-7 py-3.5 text-base font-semibold text-paper shadow-[0_10px_30px_rgba(16,16,20,0.25)] transition-transform hover:scale-[1.03] active:scale-100"
              >
                Open the Studio
              </Link>
              <a href="#templates" className="px-3 py-3.5 text-base font-semibold text-ink/70 transition-colors hover:text-ink">
                Browse templates →
              </a>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-ink/65">
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
        </div>

        {/* Frosted pill nav, bottom-center. */}
        <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
          <div className="flex items-center gap-1 rounded-full border border-paper/60 bg-paper/70 p-1.5 shadow-[var(--shadow-card)] backdrop-blur-md">
            <span className="px-2 text-ember" aria-hidden>
              ✦
            </span>
            <a href="#templates" className="rounded-full px-4 py-2 text-sm font-medium text-ink/75 hover:bg-paper hover:text-ink">
              Templates
            </a>
            <a href="#how" className="rounded-full px-4 py-2 text-sm font-medium text-ink/75 hover:bg-paper hover:text-ink">
              How it works
            </a>
            <Link to="/studio" className="flex items-center gap-1 rounded-full bg-ember px-4 py-2 text-sm font-semibold text-ink">
              Get started <span aria-hidden>›</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Frosted format strip, overlapping the card's bottom edge. */}
      <div className="relative z-10 mx-auto -mt-7 flex max-w-4xl flex-wrap items-center justify-center gap-3 px-4">
        {FORMATS.map((f) => (
          <div
            key={f}
            className="flex h-14 min-w-14 items-center justify-center rounded-2xl border border-mist bg-paper/80 px-4 font-display text-sm font-bold text-ink/70 shadow-[var(--shadow-card)] backdrop-blur"
          >
            {f}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-ink/55">Every size and format your feed wants — free.</p>
    </section>
  );
}

function StaticHero() {
  return (
    <div
      className="h-full w-full"
      style={{
        background:
          "radial-gradient(50% 45% at 72% 55%, #FFD9C9 0%, rgba(255,255,255,0) 60%)," +
          "radial-gradient(45% 40% at 30% 30%, #E9E4FF 0%, rgba(255,255,255,0) 60%), transparent",
      }}
    />
  );
}
