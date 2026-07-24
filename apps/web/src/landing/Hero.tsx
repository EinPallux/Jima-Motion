import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Badge, Container, Marker } from "../ui";

// The live showcase strip touches @jima/templates + @jima/engine — keep it behind
// its own lazy() + Suspense boundary so that heavy Pixi/registry chunk stays out
// of the eager landing bundle (size-limit "landing initial" excludes it).
const HeroStrip = lazy(() => import("./hero/HeroStrip"));

const CTA_PRIMARY =
  "inline-flex h-13 select-none items-center justify-center gap-2 rounded-full bg-primary-strong px-7 text-base font-bold text-white shadow-pop transition-all duration-150 hover:bg-primary-press active:translate-y-px";
const CTA_SECONDARY =
  "inline-flex h-13 select-none items-center justify-center gap-2 rounded-full bg-paper px-7 text-base font-bold text-ink ring-2 ring-inset ring-mist transition-all duration-150 hover:bg-canvas hover:ring-ink/20 active:translate-y-px";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper pt-10 sm:pt-14">
      {/* Soft vibrant aura — decorative, behind everything. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute left-1/2 top-[-6rem] h-80 w-[46rem] max-w-[92vw] -translate-x-1/2 rounded-full bg-emerald-tint blur-[110px]" />
        <div className="absolute left-[-6rem] top-40 h-72 w-72 rounded-full bg-pink-tint blur-3xl" />
        <div className="absolute right-[-5rem] top-24 h-72 w-72 rounded-full bg-mint-tint blur-3xl" />
      </div>

      <Container className="relative text-center">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <Badge tone="emerald" className="gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald" />
            100% free · no account · no watermark
          </Badge>

          <h1 className="headline-xl mt-6 font-display text-5xl font-extrabold text-ink sm:text-6xl lg:text-[4.75rem]">
            Motion graphics for social media, in <Marker tone="emerald">seconds</Marker>.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate sm:text-xl">
            Pick a template, type your words, drop in your images — export an MP4, WebM or GIF. It all
            renders on your device, so nothing you make ever leaves your browser.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link to="/studio" className={CTA_PRIMARY}>
              Open the Studio →
            </Link>
            <a href="#templates" className={CTA_SECONDARY}>
              Browse templates
            </a>
          </div>
        </div>
      </Container>

      {/* Live template showcase strip */}
      <div className="relative mt-14 sm:mt-16">
        <Suspense fallback={<StripFallback />}>
          <HeroStrip />
        </Suspense>
      </div>
    </section>
  );
}

function StripFallback() {
  return (
    <div className="flex justify-center gap-5 px-5 pb-4" aria-hidden>
      {[9 / 16, 1, 16 / 9, 1].map((r, i) => (
        <div
          key={i}
          style={{ width: Math.round(300 * r), height: 300 }}
          className="shrink-0 animate-pulse rounded-bento border border-mist bg-subtle"
        />
      ))}
    </div>
  );
}
