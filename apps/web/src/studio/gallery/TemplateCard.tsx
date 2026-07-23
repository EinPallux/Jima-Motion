import { useRef, useState } from "react";
import type { TemplateDefinition } from "@jima/engine";
import { PosterThumb } from "../components/PosterThumb";
import { LivePreview } from "../components/LivePreview";
import { useReducedMotion } from "../hooks/useReducedMotion";

const CATEGORY_LABEL: Record<string, string> = {
  announcement: "Announcement",
  statement: "Text",
  promo: "Promo",
  product: "Product",
  tech: "Tech",
  photo: "Photo",
  stat: "Data",
  testimonial: "Quote",
  brand: "Brand",
  event: "Event",
  educational: "Explainer",
  comparison: "Compare",
  social: "Social",
  travel: "Travel",
  showcase: "Showcase",
  overlay: "Overlay",
  intro: "Opener",
  loop: "Background",
};

export function TemplateCard({ def, onOpen }: { def: TemplateDefinition; onOpen: (def: TemplateDefinition) => void }) {
  const reduced = useReducedMotion();
  const paletteId = def.palettes[0]?.id;
  const [live, setLive] = useState(false);
  const timer = useRef<number | null>(null);

  const start = () => {
    if (reduced || live) return;
    // A short intent delay so scanning across the grid doesn't spin up a runner
    // for every card the pointer passes over.
    timer.current = window.setTimeout(() => setLive(true), 130);
  };
  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setLive(false);
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(def)}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      className="group flex flex-col overflow-hidden rounded-[18px] border border-mist bg-paper text-left shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow-pop)] focus-visible:-translate-y-1"
    >
      {/* Uniform 16:9 preview — static poster, with a live loop on hover. */}
      <div className="relative aspect-video w-full overflow-hidden bg-porcelain">
        <PosterThumb def={def} aspect="16:9" paletteId={paletteId} alt={def.name} className="absolute inset-0 h-full w-full" />
        {live && <LivePreview def={def} paletteId={paletteId} />}
        {!reduced && (
          <span
            aria-hidden
            className={`pointer-events-none absolute right-2.5 top-2.5 flex h-7 items-center gap-1 rounded-full bg-ink/70 px-2.5 text-[11px] font-semibold text-paper backdrop-blur-sm transition-opacity duration-200 ${
              live ? "opacity-0" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            ▶ Preview
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-display text-[15px] font-bold text-ink">{def.name}</h3>
          <span className="shrink-0 rounded-full bg-porcelain px-2 py-0.5 text-[11px] font-medium text-slate ring-1 ring-mist">
            {CATEGORY_LABEL[def.category] ?? def.category}
          </span>
        </div>
        <p className="line-clamp-2 text-[13px] leading-snug text-slate">{def.tagline}</p>
      </div>
    </button>
  );
}
