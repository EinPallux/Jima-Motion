import { getTemplate } from "@jima/templates";
import { LivePreview } from "../studio/components/LivePreview";
import { PosterThumb } from "../studio/components/PosterThumb";
import { useReducedMotion } from "../studio/hooks/useReducedMotion";
import { Container, MockupFrame, Reveal, SectionHeading } from "../ui";

// A decorative, non-interactive mock of the Studio: a live preview beside a
// faux inspector form — the "you edit it like a form, watch it update live"
// beat. Lazy-loaded from Landing (touches @jima/engine + registry).
const TABS = ["Content", "Style", "Motion"];
const FIELDS: { label: string; value: string; kind: "text" | "color" | "slider" }[] = [
  { label: "Headline", value: "Say it with motion.", kind: "text" },
  { label: "Subline", value: "Made in Jima Studio", kind: "text" },
  { label: "Accent", value: "#059669", kind: "color" },
  { label: "Speed", value: "1.0×", kind: "slider" },
];

export default function EditorShowcase() {
  const reduced = useReducedMotion();
  const def = getTemplate("kinetic-headline") ?? getTemplate("big-number");
  if (!def) return null;
  const paletteId = def.palettes[0]?.id;

  return (
    <section className="bg-canvas py-20 sm:py-28">
      <Container>
        <SectionHeading align="center" eyebrowTone="indigo" eyebrow="The Studio" size="lg" title="A real editor — with no timeline in sight." lead="Text, colors, fonts, speed: everything is a simple field. Change it, watch the preview update live, export." />
        <Reveal scale className="mt-14">
          <MockupFrame url="jima.app/studio" className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-[1.7fr_1fr]">
              {/* Live preview stage */}
              <div className="relative aspect-video overflow-hidden bg-porcelain">
                <PosterThumb def={def} aspect="16:9" paletteId={paletteId} alt={def.name} className="absolute inset-0 h-full w-full" />
                {!reduced && <LivePreview def={def} paletteId={paletteId} aspect="16:9" />}
              </div>

              {/* Faux inspector */}
              <div className="border-t border-mist bg-paper p-5 sm:border-l sm:border-t-0" aria-hidden>
                <div className="flex gap-1">
                  {TABS.map((t, i) => (
                    <span key={t} className={`rounded-lg px-3 py-1.5 text-sm font-bold ${i === 0 ? "bg-primary-strong text-white" : "text-slate"}`}>{t}</span>
                  ))}
                </div>
                <div className="mt-5 flex flex-col gap-4">
                  {FIELDS.map((f) => (
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
                            <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-primary-strong" />
                            <div className="absolute left-1/3 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-strong ring-2 ring-paper" />
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
