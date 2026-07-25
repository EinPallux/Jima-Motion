import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { Aspect } from "@jima/engine";
import { getTemplate } from "@jima/templates";
import { LivePreview } from "../../studio/components/LivePreview";
import { PosterThumb } from "../../studio/components/PosterThumb";
import { useReducedMotion } from "../../studio/hooks/useReducedMotion";
import { Container } from "../../ui";

// A varied row of template cards under the hero headline (Jitter-style). Mixed
// aspects at a uniform height read as a lively, editorial strip. A few play live
// (WebGL); the rest are cheap static posters. Lazy-loaded so the engine/registry
// chunk stays out of the eager landing bundle.
//
// The strip is held to the page's content column and is deliberately a little
// wider than it, so the outer cards peek in and dissolve at the edges rather
// than hard-cutting at the viewport (.edge-fade-x). Both ends are 16:9 — the
// widest aspect — so each peek is a readable slice instead of a sliver, and the
// order keeps every live preview fully inside the column (no WebGL context
// rendering off-screen for nothing).
type Item = { id: string; aspect: Aspect; live?: boolean; tone: string };
const ITEMS: Item[] = [
  { id: "map-route", aspect: "16:9", tone: "bg-emerald-tint" },
  { id: "product-pop", aspect: "1:1", live: true, tone: "bg-coral-tint" },
  { id: "deal-countdown", aspect: "9:16", tone: "bg-amber-tint" },
  { id: "coverflow", aspect: "1:1", tone: "bg-indigo-tint" },
  { id: "rating-reveal", aspect: "9:16", live: true, tone: "bg-pink-tint" },
  { id: "poll-results", aspect: "16:9", live: true, tone: "bg-mint-tint" },
];

// Uniform card height; each card's width follows its aspect ratio. It tracks the
// viewport between roughly 1024px and 1272px (where the content column stops
// growing) so the overhang past that column stays proportional instead of
// swallowing whole cards on smaller desktops.
const CARD_H = "clamp(176px, 17vw, 216px)";
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
    // Held to the page's content width and faded at both ends with a mask, so
    // the row genuinely dissolves (works over any background, no colour to
    // match). Below lg it stays a swipeable scroller; from lg up it centres and
    // `overflow-x: clip` crops it to the column — clip rather than hidden so the
    // vertical axis stays visible and the cards' float + soft shadows aren't
    // sliced off top and bottom.
    <Container>
      <div className="edge-fade-x flex items-center justify-start gap-4 overflow-x-auto pb-4 pt-2 lg:justify-center lg:gap-5 lg:overflow-x-clip [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cards.map((c, i) => (
          <Link
            key={c.id}
            to={`/studio?t=${c.def.id}`}
            aria-label={`Edit ${c.def.name}`}
            style={{ height: CARD_H, aspectRatio: RATIO[c.aspect], animationDelay: `${i * 0.6}s` }}
            className={`group relative shrink-0 overflow-hidden rounded-bento border border-mist ${c.tone} shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-bold ${reduced ? "" : "float-slow"}`}
          >
            <PosterThumb def={c.def} aspect={c.aspect} paletteId={c.def.palettes[0]?.id} alt={c.def.name} className="absolute inset-0 h-full w-full" />
            {!reduced && c.live && <LivePreview def={c.def} paletteId={c.def.palettes[0]?.id} aspect={c.aspect} />}
            <span className="absolute bottom-2 left-2 z-10 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-bold text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
              {c.def.name}
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
