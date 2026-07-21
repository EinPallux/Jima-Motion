import { Link } from "react-router-dom";
import { templates } from "@jima/templates";
import type { TemplateDefinition } from "@jima/engine";
import { PosterThumb } from "../studio/components/PosterThumb";

function Card({ def }: { def: TemplateDefinition }) {
  return (
    <Link
      to={`/studio?t=${def.id}`}
      className="group/card block w-[190px] shrink-0 overflow-hidden rounded-[18px] border border-mist bg-paper shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1 sm:w-[220px]"
    >
      <PosterThumb def={def} aspect="1:1" paletteId={def.palettes[0]?.id} alt={def.name} className="w-full" />
      <div className="px-3 py-2.5">
        <p className="font-display text-sm font-bold text-ink">{def.name}</p>
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
        style={{ animation: `jima-marquee-${direction} 42s linear infinite` }}
      >
        {loop.map((def, i) => (
          <Card key={`${def.id}-${i}`} def={def} />
        ))}
      </div>
    </div>
  );
}

export function TemplateRail() {
  const half = Math.ceil(templates.length / 2);
  const rowA = templates.slice(0, half);
  const rowB = templates.slice(half);
  return (
    <section className="overflow-hidden py-16" aria-label="Template previews">
      <div className="flex flex-col gap-4">
        <Row items={rowA} direction="left" />
        <Row items={rowB} direction="right" />
      </div>
      <p className="mt-8 text-center text-sm text-slate">
        {templates.length} templates at launch — all free, all yours.
      </p>
    </section>
  );
}
