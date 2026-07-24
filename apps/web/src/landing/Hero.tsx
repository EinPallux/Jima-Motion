import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Badge, Container } from "../ui";

// The live showcase (right column) touches @jima/templates + @jima/engine —
// the same heavy Pixi/registry chunk TemplateRail and GalleryTeaser already
// defer (see apps/web/package.json size-limit: "landing initial" excludes it).
// Hero itself is NOT route-lazy, so importing that chunk here directly would
// pull it into the eager landing bundle — keep it behind its own lazy() +
// Suspense boundary instead, exactly like the old HeroBackground pattern did
// for the three.js blob it replaces.
const HeroShowcase = lazy(() => import("./hero/HeroShowcase"));

const TRUST = ["Free forever", "No account", "No watermark", "Private by design"];

// See Navbar.tsx for why route CTAs are real <a>/<Link> elements styled like
// the Button primitive rather than literal <Button>s (role="link" + no
// nested-interactive markup).
const CTA_PRIMARY =
  "inline-flex h-12 select-none items-center justify-center gap-2 rounded-xl bg-primary-strong px-6 text-base font-semibold text-white shadow-xs transition-colors duration-150 hover:bg-primary-press active:bg-primary-press";
const CTA_SECONDARY =
  "inline-flex h-12 select-none items-center justify-center gap-2 rounded-xl bg-paper px-6 text-base font-semibold text-ink ring-1 ring-inset ring-mist transition-colors duration-150 hover:bg-canvas hover:ring-slate/30";

export function Hero() {
  return (
    <section className="bg-paper">
      <Container className="grid gap-12 pb-16 pt-14 sm:pt-20 lg:grid-cols-2 lg:items-center lg:gap-10 lg:pb-24 lg:pt-24">
        {/* Copy column */}
        <div className="flex flex-col">
          <Badge tone="emerald" className="w-fit">
            100% free · no account
          </Badge>

          <h1 className="mt-5 max-w-xl font-display text-5xl font-extrabold text-ink sm:text-6xl">
            Motion graphics for social media, in seconds.
          </h1>

          <p className="mt-5 max-w-md text-lg text-slate">
            Pick a template, type your words, drop in your images — export an MP4, WebM or GIF. It
            all renders on your device, so nothing you make ever leaves your browser.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/studio" className={CTA_PRIMARY}>
              Open the Studio
            </Link>
            <a href="#templates" className={CTA_SECONDARY}>
              Browse templates
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-graphite">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-primary-strong" aria-hidden fill="none">
                  <path
                    d="M4 10.5l3.5 3.5L16 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Live template showcase */}
        <Suspense fallback={<ShowcaseFallback />}>
          <HeroShowcase />
        </Suspense>
      </Container>
    </section>
  );
}

/** Skeleton shown for the instant before the showcase chunk arrives — no engine dependency. */
function ShowcaseFallback() {
  return (
    <div className="w-full" aria-hidden>
      <div className="aspect-video w-full animate-pulse rounded-card border border-mist bg-subtle" />
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="aspect-square animate-pulse rounded-card border border-mist bg-subtle" />
        <div className="aspect-square animate-pulse rounded-card border border-mist bg-subtle" />
      </div>
    </div>
  );
}
