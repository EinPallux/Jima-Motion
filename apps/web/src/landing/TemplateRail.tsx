import { Link } from "react-router-dom";
import { templates } from "@jima/templates";
import type { TemplateDefinition } from "@jima/engine";
import { PosterThumb } from "../studio/components/PosterThumb";

function RailCard({ def }: { def: TemplateDefinition }) {
  return (
    <Link
      to={`/studio?t=${def.id}`}
      className="group/card block w-[190px] shrink-0 overflow-hidden rounded-bento border border-mist bg-paper shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-pop sm:w-[220px]"
    >
      <PosterThumb def={def} aspect="1:1" paletteId={def.palettes[0]?.id} alt={def.name} className="w-full" />
      <div className="px-3 py-2.5">
        <p className="truncate font-display text-sm font-bold text-ink">{def.name}</p>
      </div>
    </Link>
  );
}

function Row({ items, direction }: { items: TemplateDefinition[]; direction: "left" | "right" }) {
  const loop = [...items, ...items];
  return (
    <div className="group flex overflow-hidden">
      <div
        className="flex shrink-0 gap-4 pr-4 group-hover:[animation-play-state:paused]"
        style={{ animation: `jima-marquee-${direction} 120s linear infinite` }}
      >
        {loop.map((def, i) => (
          <RailCard key={`${def.id}-${i}`} def={def} />
        ))}
      </div>
    </div>
  );
}

export function TemplateRail() {
  // Sample the library evenly for a varied, lighter marquee — rendering every
  // one of the 274 posters would be hundreds of WebGL draws. This gives a
  // representative spread that scrolls at a calm, readable pace.
  const sample = templates.filter((_, i) => i % 5 === 0);
  const half = Math.ceil(sample.length / 2);
  const rowA = sample.slice(0, half);
  const rowB = sample.slice(half);
  return (
    <section className="overflow-hidden bg-canvas py-14 sm:py-16" aria-label="Template previews">
      <div className="flex flex-col gap-4">
        <Row items={rowA} direction="left" />
        <Row items={rowB} direction="right" />
      </div>
      <p className="mt-8 text-center text-base font-bold text-graphite">
        {templates.length} templates and counting — all free, all yours.
      </p>
    </section>
  );
}
