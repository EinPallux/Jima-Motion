import type { TemplateDefinition } from "@jima/engine";
import { PosterThumb } from "../components/PosterThumb";

const CATEGORY_LABEL: Record<string, string> = {
  announcement: "Announcement",
  statement: "Statement",
  promo: "Promo",
  product: "Product",
  tech: "Tech",
  photo: "Photo",
  stat: "Stat",
  testimonial: "Quote",
  brand: "Brand",
  event: "Event",
  educational: "Tips",
  comparison: "Compare",
  social: "Social",
  travel: "Travel",
};

export function TemplateCard({ def, onOpen }: { def: TemplateDefinition; onOpen: (def: TemplateDefinition) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(def)}
      className="group flex flex-col overflow-hidden rounded-[20px] border border-mist bg-paper text-left shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1"
    >
      <PosterThumb def={def} aspect={def.defaultAspect} paletteId={def.palettes[0]?.id} alt={def.name} className="w-full" />
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-base font-bold text-ink">{def.name}</h3>
          <span className="shrink-0 rounded-full bg-ember-tint px-2 py-0.5 text-[11px] font-medium text-ember-text">
            {CATEGORY_LABEL[def.category] ?? def.category}
          </span>
        </div>
        <p className="text-sm text-slate">{def.tagline}</p>
      </div>
    </button>
  );
}
