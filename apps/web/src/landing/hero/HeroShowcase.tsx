import { useEffect, useMemo, useState } from "react";
import { getTemplate } from "@jima/templates";
import { LivePreview } from "../../studio/components/LivePreview";
import { PosterThumb } from "../../studio/components/PosterThumb";
import { useReducedMotion } from "../../studio/hooks/useReducedMotion";

// A rotating set of real, visually-varied templates from the registry — the
// big hero preview cycles through these so the showcase feels alive. Verified
// to exist in @jima/templates.
const SHOWCASE_IDS = ["gradient-text", "kinetic-headline", "reel-frame", "glow-promo", "stat-bars", "flash-sale"];
const SIDE_IDS = ["product-hero", "big-number"];
const CYCLE_MS = 4200;

/**
 * The hero's right column: one large preview in a faux-browser frame that
 * cycles through several looping template animations, plus two smaller static
 * poster cards. Lazy-loaded from Hero.tsx so the Pixi/template-registry chunk
 * stays out of the eager landing bundle (see Hero.tsx's lazy() boundary).
 * Reduced-motion: no cycling, a single static poster (no live WebGL preview).
 */
export default function HeroShowcase() {
  const reduced = useReducedMotion();
  const defs = useMemo(
    () => SHOWCASE_IDS.map((id) => getTemplate(id)).filter((d): d is NonNullable<ReturnType<typeof getTemplate>> => Boolean(d)),
    [],
  );
  const sides = useMemo(
    () => SIDE_IDS.map((id) => getTemplate(id)).filter((d): d is NonNullable<ReturnType<typeof getTemplate>> => Boolean(d)),
    [],
  );
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced || defs.length < 2) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % defs.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduced, defs.length]);

  const current = defs[Math.min(i, Math.max(0, defs.length - 1))];

  return (
    <div className="w-full">
      {current && (
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
            {/* Keyed by template id so each one cleanly remounts + fades in. */}
            <div key={current.id} className="absolute inset-0 motion-safe:animate-[jima-fade-in_500ms_ease-out]">
              <PosterThumb
                def={current}
                aspect="16:9"
                paletteId={current.palettes[0]?.id}
                alt={current.name}
                className="absolute inset-0 h-full w-full"
              />
              {!reduced && <LivePreview def={current} paletteId={current.palettes[0]?.id} />}
            </div>

            {/* Live template name */}
            <span className="absolute right-3 top-3 z-10 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {current.name}
            </span>

            {/* Rotation indicators */}
            {defs.length > 1 && !reduced && (
              <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5" aria-hidden>
                {defs.map((d, n) => (
                  <span
                    key={d.id}
                    className={`h-1.5 rounded-full transition-all duration-300 ${n === i ? "w-5 bg-primary-strong" : "w-1.5 bg-ink/20"}`}
                  />
                ))}
              </div>
            )}
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
