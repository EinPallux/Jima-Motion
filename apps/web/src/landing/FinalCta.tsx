import { Link } from "react-router-dom";
import { Container } from "../ui";

// A bold, vibrant closing band — a bright emerald color block (not a dark
// section; ink text on #10b981 is ≥6:1) with an oversized headline, echoing the
// bold "upgrade" bands of modern SaaS landing pages while staying fully light.
// focus-visible:outline-ink overrides the global emerald focus ring, which on
// this bright-emerald band is only 2.16:1 — ink gives a ≥6:1 visible ring.
const CTA_DARK =
  "inline-flex h-13 select-none items-center justify-center gap-2 rounded-xl bg-ink px-7 text-base font-bold text-white shadow-xs transition-all duration-150 hover:bg-graphite active:translate-y-px focus-visible:outline-ink";
const CTA_OUTLINE =
  "inline-flex h-13 select-none items-center justify-center gap-2 rounded-xl border-2 border-ink bg-transparent px-7 text-base font-bold text-ink transition-all duration-150 hover:bg-ink/5 active:translate-y-px focus-visible:outline-ink";

export function FinalCta() {
  return (
    <section className="bg-paper pb-20 pt-2 sm:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-bento bg-emerald px-6 py-16 text-center shadow-bold sm:px-12 sm:py-20">
          {/* Decorative vibrant glows — purely cosmetic. */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-12 -top-12 h-48 w-48 rounded-full bg-emerald-bright/50 blur-2xl" />
            <div className="absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-mint/40 blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="headline-xl mx-auto max-w-3xl font-display text-4xl font-extrabold text-ink sm:text-6xl">
              It&rsquo;s time to make something move.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg font-semibold text-ink">
              274 templates. No account, no watermark, no catch — open the Studio and export your
              first animation in about a minute.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link to="/studio" className={CTA_DARK}>
                Open the Studio
              </Link>
              <a href="#templates" className={CTA_OUTLINE}>
                Browse templates
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
