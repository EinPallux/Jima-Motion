import { getTemplate } from "@jima/templates";
import { LivePreview } from "../../studio/components/LivePreview";
import { PosterThumb } from "../../studio/components/PosterThumb";
import { useReducedMotion } from "../../studio/hooks/useReducedMotion";

// Real templates from the registry — verified to exist in @jima/templates.
const SHOWCASE_ID = "gradient-text";
const SIDE_IDS = ["product-hero", "big-number"];

/**
 * The hero's right column: one large looping live preview in a faux-browser
 * frame, plus two smaller static poster cards. Lazy-loaded from Hero.tsx so
 * the Pixi/template-registry chunk it needs stays out of the eager landing
 * bundle (see Hero.tsx's comment on the lazy() boundary).
 */
export default function HeroShowcase() {
  const reduced = useReducedMotion();
  const showcase = getTemplate(SHOWCASE_ID);
  const sides = SIDE_IDS.map((id) => getTemplate(id)).filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <div className="w-full">
      {showcase && (
        <div className="overflow-hidden rounded-card border border-mist bg-paper shadow-pop">
          {/* Faux browser topbar */}
          <div className="flex items-center gap-1.5 border-b border-mist bg-canvas px-4 py-3" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-mist" />
            <span className="h-2.5 w-2.5 rounded-full bg-mist" />
            <span className="h-2.5 w-2.5 rounded-full bg-mist" />
            <span className="ml-2 truncate rounded-full bg-paper px-3 py-1 text-xs font-medium text-slate ring-1 ring-inset ring-mist">
              jima.app/studio
            </span>
          </div>
          <div className="relative aspect-video w-full overflow-hidden bg-porcelain">
            <PosterThumb
              def={showcase}
              aspect="16:9"
              paletteId={showcase.palettes[0]?.id}
              alt={showcase.name}
              className="absolute inset-0 h-full w-full"
            />
            {!reduced && <LivePreview def={showcase} paletteId={showcase.palettes[0]?.id} />}
          </div>
        </div>
      )}

      {sides.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-4">
          {sides.map((def) => (
            <div key={def.id} className="overflow-hidden rounded-card border border-mist bg-paper shadow-card">
              <PosterThumb def={def} aspect="1:1" paletteId={def.palettes[0]?.id} alt={def.name} className="w-full" />
              <p className="truncate px-3 py-2 font-display text-sm font-bold text-ink">{def.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
