import type { CSSProperties } from "react";
import { getTemplate } from "@jima/templates";
import { LivePreview } from "../studio/components/LivePreview";
import { PosterThumb } from "../studio/components/PosterThumb";
import { categoryLabel } from "../studio/gallery/groups";
import { useReducedMotion } from "../studio/hooks/useReducedMotion";
import { Badge, Container, MockupFrame, Reveal, SectionHeading } from "../ui";

// A decorative, non-interactive mock of the Studio: a live preview on the real
// dotted stage beside a faux inspector — the "you edit it like a form, watch it
// update live" beat. Lazy-loaded from Landing (touches @jima/engine + registry).
//
// The example is Voice Note, and the fields below are its actual fields with
// their actual defaults — including `noteLen`, the kind of template-specific
// control that makes the point better than a generic "Headline" box would.
const TEMPLATE_ID = "voice-note";
const PREVIEW_ASPECT = "1:1" as const;

// The real stage backdrop (studio/editor/PreviewStage.tsx).
const STAGE_BG: CSSProperties = {
  backgroundImage: "radial-gradient(circle, rgba(10,10,13,0.05) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
  backgroundPosition: "center",
};

const TABS = ["Content", "Style", "Motion"];

type Field =
  | { label: string; kind: "text"; value: string }
  | { label: string; kind: "color"; value: string }
  | { label: string; kind: "slider"; value: string; fill: number };

export default function EditorShowcase() {
  const reduced = useReducedMotion();
  const def = getTemplate(TEMPLATE_ID);
  if (!def) return null;
  const palette = def.palettes[0];
  const paletteId = palette?.id;

  const fields: Field[] = [
    { label: "Sender name", kind: "text", value: "Maya" },
    { label: "Reply", kind: "text", value: "Hahaha love this 😂" },
    // The template's own accent, so the swatch matches the preview beside it.
    { label: "Accent", kind: "color", value: palette?.colors.accent ?? "#0A62D0" },
    // 7s on a 3–30s range — the real default, at its real position.
    { label: "Note length", kind: "slider", value: "7s", fill: (7 - 3) / (30 - 3) },
  ];

  return (
    <section className="bg-canvas py-20 sm:py-28">
      <Container>
        <SectionHeading align="center" eyebrowTone="indigo" eyebrow="The Studio" size="lg" title="A real editor — with no timeline in sight." lead="Text, colors, fonts, speed: everything is a simple field. Change it, watch the preview update live, export." />
        <Reveal scale className="mt-14">
          <MockupFrame url="jima.app/studio" className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-[1.7fr_1fr]">
              {/* Live preview on the dotted stage, at the template's own aspect.
                  min-w-0 on both columns: without it each one's min-content width
                  wins over the fr ratio and the inspector spills out of the frame.
                  The stage takes its height from the inspector beside it (with a
                  floor for the stacked mobile layout), and the canvas fills it —
                  same as the real Studio, where the stage is whatever is left. */}
              <div className="relative flex min-h-[320px] min-w-0 items-center justify-center bg-canvas p-5" style={STAGE_BG}>
                <div className="relative h-full max-w-full overflow-hidden rounded-xl bg-paper shadow-pop ring-1 ring-ink/10" style={{ aspectRatio: "1 / 1" }}>
                  <PosterThumb def={def} aspect={PREVIEW_ASPECT} paletteId={paletteId} alt={def.name} className="absolute inset-0 h-full w-full" />
                  {!reduced && <LivePreview def={def} paletteId={paletteId} aspect={PREVIEW_ASPECT} />}
                </div>
              </div>

              {/* Faux inspector */}
              <div className="min-w-0 border-t border-mist bg-paper p-5 md:border-l md:border-t-0" aria-hidden>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">Editing</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate font-display text-lg font-extrabold text-ink">{def.name}</span>
                  <Badge tone="emerald" className="shrink-0 px-2 py-0.5 text-[11px]">{categoryLabel(def.category)}</Badge>
                </div>
                <div className="mt-4 flex gap-1">
                  {TABS.map((t, i) => (
                    <span key={t} className={`rounded-lg px-2.5 py-1.5 text-[13px] font-bold lg:px-3 lg:text-sm ${i === 0 ? "bg-primary-strong text-white" : "text-slate"}`}>{t}</span>
                  ))}
                </div>
                <div className="mt-5 flex flex-col gap-4">
                  {fields.map((f) => (
                    <div key={f.label}>
                      <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">{f.label}</div>
                      {f.kind === "text" && <div className="truncate rounded-input border border-mist bg-paper px-3 py-2 text-sm text-ink">{f.value}</div>}
                      {f.kind === "color" && (
                        <div className="flex items-center gap-2 rounded-input border border-mist bg-paper px-2 py-1.5">
                          <span className="h-6 w-6 rounded-md" style={{ background: f.value }} />
                          <span className="font-mono text-sm uppercase text-ink">{f.value}</span>
                        </div>
                      )}
                      {f.kind === "slider" && (
                        <div className="flex items-center gap-3">
                          <div className="relative h-1.5 flex-1 rounded-full bg-subtle">
                            <div className="absolute inset-y-0 left-0 rounded-full bg-primary-strong" style={{ width: `${f.fill * 100}%` }} />
                            <div className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-strong ring-2 ring-paper" style={{ left: `${f.fill * 100}%` }} />
                          </div>
                          <span className="text-sm font-bold tabular-nums text-ink">{f.value}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary-strong text-sm font-bold text-white">Export ▸</div>
              </div>
            </div>
          </MockupFrame>
        </Reveal>
      </Container>
    </section>
  );
}
