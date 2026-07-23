import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "../studio/hooks/useReducedMotion";
import { hasWebGL2 } from "../studio/CapabilityFloor";

const HeroBackground = lazy(() => import("./hero/HeroBackground"));

const CHIPS = ["100% free", "No account", "No watermark", "Private by design"];
const ASPECTS = ["1:1", "4:5", "9:16", "16:9"];

export function Hero() {
  const reduced = useReducedMotion();
  // Probe WebGL2 once (calling it inline each render leaks throwaway contexts).
  const [webglOK] = useState(hasWebGL2);
  const showWebGL = webglOK && !reduced;

  return (
    <section className="mx-auto max-w-6xl px-5 pt-6 sm:px-6 sm:pt-10">
      <div className="grid items-center gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
        {/* Copy */}
        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-mist bg-porcelain px-3.5 py-1.5 text-sm font-medium text-slate">
            <span className="text-ember" aria-hidden>✦</span>
            Free forever · no account · nothing uploaded
          </span>

          <h1 className="mt-5 font-display text-[2.65rem] font-bold leading-[1.03] tracking-tight text-ink sm:text-6xl lg:text-[4.1rem]">
            Motion graphics for social media.{" "}
            <span className="bg-gradient-to-r from-ember via-candy to-violet bg-clip-text text-transparent">
              In seconds.
            </span>
          </h1>

          <p className="mt-5 max-w-md text-lg text-slate">
            Pick a template, type your words, drop in your images — export an MP4, WebM or GIF. It all
            renders on your device, so it&rsquo;s free and nothing you make ever leaves your browser.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/studio"
              className="rounded-full bg-ink px-7 py-3.5 text-base font-semibold text-paper shadow-[0_12px_30px_rgba(16,16,20,0.22)] transition-transform hover:scale-[1.03] active:scale-100"
            >
              Open the Studio
            </Link>
            <a
              href="#templates"
              className="rounded-full border border-mist px-6 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-porcelain"
            >
              Browse templates →
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate">
            {CHIPS.map((c) => (
              <li key={c} className="flex items-center gap-1.5">
                <span className="text-ember" aria-hidden>✦</span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Bento */}
        <div className="grid gap-4 sm:gap-5">
          {/* Showpiece: the 3D blob on a deep gradient. */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[linear-gradient(150deg,#241154_0%,#4a2288_46%,#8a2f9e_100%)] shadow-[var(--shadow-card)] sm:aspect-[16/10]">
            <div className="absolute inset-0" aria-hidden>
              {showWebGL ? (
                <Suspense fallback={<StaticBlob />}>
                  <HeroBackground animate />
                </Suspense>
              ) : (
                <StaticBlob />
              )}
            </div>
            {/* Frosted label + arrow, kept off the blob's center. */}
            <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              <span aria-hidden>●</span> Rendered live in your browser
            </span>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
            <p className="absolute bottom-4 left-4 z-10 max-w-[62%] text-[15px] font-semibold leading-snug text-white">
              Bold, animated, on-brand — no timeline required.
            </p>
            <Link
              to="/studio"
              aria-label="Open the Studio"
              className="absolute bottom-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition-transform hover:scale-105"
            >
              <span aria-hidden className="text-lg">↗</span>
            </Link>
          </div>

          {/* Two supporting cards. */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div className="flex flex-col justify-between rounded-[24px] bg-[linear-gradient(150deg,#d8f34d_0%,#7ee0b0_55%,#38c7ff_100%)] p-5 shadow-[var(--shadow-card)]">
              <span className="text-sm font-semibold text-ink/80">Templates, ready to go</span>
              <div>
                <div className="font-display text-5xl font-bold leading-none text-ink">155</div>
                <div className="mt-1 text-sm font-medium text-ink/75">animated & fully editable</div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[24px] border border-mist bg-paper p-5 shadow-[var(--shadow-card)]">
              <span className="text-sm font-semibold text-slate">Every size &amp; format</span>
              <div className="mt-3">
                <div className="font-display text-base font-bold text-ink">MP4 · WebM · GIF</div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {ASPECTS.map((a) => (
                    <span
                      key={a}
                      className="rounded-lg bg-porcelain px-2 py-1 font-display text-xs font-bold text-slate ring-1 ring-mist"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** No-WebGL / reduced-motion fallback: a soft iridescent orb via CSS. */
function StaticBlob() {
  return (
    <div className="h-full w-full" aria-hidden>
      <div
        className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[2px]"
        style={{
          background:
            "radial-gradient(38% 38% at 38% 32%, #ffffff 0%, rgba(255,255,255,0) 60%)," +
            "radial-gradient(60% 60% at 65% 68%, #ff6a3d 0%, rgba(255,106,61,0) 62%)," +
            "radial-gradient(70% 70% at 30% 70%, #38c7ff 0%, rgba(56,199,255,0) 60%)," +
            "linear-gradient(150deg, #ff2e9e 0%, #7c5cff 55%, #38c7ff 100%)",
          boxShadow: "0 30px 60px rgba(20,10,40,0.35)",
        }}
      />
    </div>
  );
}
