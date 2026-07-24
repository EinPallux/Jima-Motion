import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { Aspect } from "@jima/engine";
import { getTemplate } from "@jima/templates";
import { LivePreview } from "../../studio/components/LivePreview";
import { PosterThumb } from "../../studio/components/PosterThumb";
import { useReducedMotion } from "../../studio/hooks/useReducedMotion";

// A varied row of template cards under the hero headline (Jitter-style). Mixed
// aspects at a uniform height read as a lively, editorial strip. A few play live
// (WebGL); the rest are cheap static posters. Lazy-loaded so the engine/registry
// chunk stays out of the eager landing bundle.
type Item = { id: string; aspect: Aspect; live?: boolean; tone: string };
const ITEMS: Item[] = [
  { id: "deal-countdown", aspect: "9:16", tone: "bg-amber-tint" },
  { id: "product-pop", aspect: "1:1", live: true, tone: "bg-coral-tint" },
  { id: "poll-results", aspect: "16:9", live: true, tone: "bg-mint-tint" },
  { id: "coverflow", aspect: "1:1", tone: "bg-indigo-tint" },
  { id: "rating-reveal", aspect: "9:16", live: true, tone: "bg-pink-tint" },
  { id: "map-route", aspect: "16:9", tone: "bg-emerald-tint" },
];

const H = 300; // uniform card height (px); width follows the aspect ratio.
const RATIO: Record<Aspect, number> = { "1:1": 1, "4:5": 0.8, "9:16": 9 / 16, "16:9": 16 / 9 };

export default function HeroStrip() {
  const reduced = useReducedMotion();
  const cards = useMemo(
    () =>
      ITEMS.map((it) => ({ ...it, def: getTemplate(it.id) })).filter(
        (c): c is Item & { def: NonNullable<ReturnType<typeof getTemplate>> } => Boolean(c.def),
      ),
    [],
  );

  return (
    <div className="relative">
      {/* soft fade at both edges so the strip melts into the page */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent sm:w-28" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent sm:w-28" />

      <div className="flex items-center justify-start gap-4 overflow-x-auto px-5 pb-4 pt-2 sm:justify-center sm:gap-5 sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cards.map((c, i) => {
          const w = Math.round(H * RATIO[c.aspect]);
          return (
            <Link
              key={c.id}
              to={`/studio?t=${c.def.id}`}
              aria-label={`Edit ${c.def.name}`}
              style={{ width: w, height: H, animationDelay: `${i * 0.6}s` }}
              className={`group relative shrink-0 overflow-hidden rounded-bento border border-mist ${c.tone} shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-bold ${reduced ? "" : "float-slow"}`}
            >
              <PosterThumb def={c.def} aspect={c.aspect} paletteId={c.def.palettes[0]?.id} alt={c.def.name} className="absolute inset-0 h-full w-full" />
              {!reduced && c.live && <LivePreview def={c.def} paletteId={c.def.palettes[0]?.id} aspect={c.aspect} />}
              <span className="absolute bottom-2 left-2 z-10 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-bold text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                {c.def.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
