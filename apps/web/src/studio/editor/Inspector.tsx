import { useState } from "react";
import { FONT_CHOICES, SOUND_PACKS, type TemplateDefinition, type TemplateField } from "@jima/engine";
import { useStudio } from "../state/store";
import { Field } from "../components/Field";
import { categoryLabel } from "../gallery/groups";
import { Badge, Button, cn } from "../../ui";

type Tab = "content" | "style" | "motion";

const CONTENT_TYPES = new Set(["text", "textarea", "textlist", "image"]);
const MOTION_TYPES = new Set(["select", "slider", "toggle"]);

/** Small uppercase group label used to break the inspector into labeled sections. */
const groupLabelCls = "text-[11px] font-bold uppercase tracking-[0.1em] text-graphite";

export function Inspector({ def, baseDuration }: { def: TemplateDefinition; baseDuration: number }) {
  const [tab, setTab] = useState<Tab>("content");
  const values = useStudio((s) => s.values);
  const setValue = useStudio((s) => s.setValue);
  const reset = useStudio((s) => s.reset);

  const content = def.fields.filter((f) => CONTENT_TYPES.has(f.type));
  const colors = def.fields.filter((f) => f.type === "color");
  const motion = def.fields.filter((f) => MOTION_TYPES.has(f.type));

  return (
    <div className="flex h-full flex-col bg-paper">
      <div className="px-4 pb-3 pt-4">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">Editing</p>
        <div className="mt-1 flex items-center gap-2">
          <h2 className="min-w-0 flex-1 truncate font-display text-lg font-extrabold text-ink">{def.name}</h2>
          <Badge tone="emerald" className="shrink-0 px-2 py-0.5 text-[11px]">
            {categoryLabel(def.category)}
          </Badge>
        </div>
      </div>

      <div role="tablist" aria-label="Editor panels" className="flex gap-1 border-b border-mist px-4">
        <TabButton id="content" active={tab} onSelect={setTab} label="Content" />
        <TabButton id="style" active={tab} onSelect={setTab} label="Style" />
        <TabButton id="motion" active={tab} onSelect={setTab} label="Motion" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {tab === "content" && (
          <FieldGroup fields={content} values={values} onChange={setValue} def={def} emptyHint="This template has no text fields." />
        )}
        {tab === "style" && <StyleTab def={def} colors={colors} values={values} onChange={setValue} />}
        {tab === "motion" && <MotionTab def={def} motionFields={motion} values={values} onChange={setValue} baseDuration={baseDuration} />}
      </div>

      <div className="border-t border-mist px-4 py-3">
        <Button variant="ghost" size="sm" onClick={reset}>
          ↺ Reset template
        </Button>
      </div>
    </div>
  );
}

function TabButton({ id, active, onSelect, label }: { id: Tab; active: Tab; onSelect: (t: Tab) => void; label: string }) {
  const isActive = active === id;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(id)}
      className={cn(
        "rounded-t-lg border-b-2 px-3 py-2.5 text-[15px] font-bold transition-colors",
        isActive ? "border-primary-strong text-ink" : "border-transparent text-slate hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}

function FieldGroup({
  fields,
  values,
  onChange,
  def,
  emptyHint,
}: {
  fields: TemplateField[];
  values: Record<string, unknown>;
  onChange: (key: string, v: unknown) => void;
  def: TemplateDefinition;
  emptyHint?: string;
}) {
  if (fields.length === 0) return <p className="text-sm text-slate">{emptyHint}</p>;
  return (
    <div className="flex flex-col gap-6">
      {fields.map((f) => (
        <Field key={f.key} field={f} value={values[f.key]} onChange={(v) => onChange(f.key, v)} blobKeyPrefix={def.id} />
      ))}
    </div>
  );
}

function StyleTab({
  def,
  colors,
  values,
  onChange,
}: {
  def: TemplateDefinition;
  colors: TemplateField[];
  values: Record<string, unknown>;
  onChange: (key: string, v: unknown) => void;
}) {
  const paletteId = useStudio((s) => s.paletteId);
  const setPalette = useStudio((s) => s.setPalette);
  const font = useStudio((s) => s.font);
  const setFont = useStudio((s) => s.setFont);
  const currentFont = font ?? "default";
  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className={groupLabelCls}>Font</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {FONT_CHOICES.map((f) => {
            const active = f.id === currentFont;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFont(f.id === "default" ? undefined : f.id)}
                aria-pressed={active}
                className={cn(
                  "truncate rounded-xl border-2 px-3 py-2.5 text-left text-[15px] font-medium transition-colors",
                  active ? "border-primary-strong bg-emerald-tint text-ink" : "border-mist text-graphite hover:border-slate hover:bg-subtle",
                )}
                style={{ fontFamily: `"${f.family}"` }}
                title={f.label}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-mist pt-6">
        <p className={groupLabelCls}>Palette</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {def.palettes.map((p) => {
            const active = p.id === paletteId;
            const swatches = Object.values(p.colors);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPalette(p.id)}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-2 rounded-xl border-2 p-2 text-left transition-colors",
                  active ? "border-primary-strong bg-emerald-tint" : "border-mist hover:border-slate hover:bg-subtle",
                )}
              >
                <span className="flex overflow-hidden rounded-md border border-mist">
                  {swatches.map((c, i) => (
                    <span key={i} className="h-6 w-3" style={{ background: c }} />
                  ))}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-graphite">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-mist pt-6">
        <p className={groupLabelCls}>Colors</p>
        <p className="mt-1.5 text-xs text-slate">Pick any color for the background, text and objects — palettes above are just quick presets.</p>
        <div className="mt-3">
          <FieldGroup fields={colors} values={values} onChange={onChange} def={def} emptyHint="This template has no color options." />
        </div>
      </div>
    </div>
  );
}

function MotionTab({
  def,
  motionFields,
  values,
  onChange,
  baseDuration,
}: {
  def: TemplateDefinition;
  motionFields: TemplateField[];
  values: Record<string, unknown>;
  onChange: (key: string, v: unknown) => void;
  baseDuration: number;
}) {
  const speed = useStudio((s) => s.speed);
  const setSpeed = useStudio((s) => s.setSpeed);
  const loop = useStudio((s) => s.loop);
  const setLoop = useStudio((s) => s.setLoop);
  const sound = useStudio((s) => s.sound);
  const setSound = useStudio((s) => s.setSound);
  const soundPack = useStudio((s) => s.soundPack);
  const setSoundPack = useStudio((s) => s.setSoundPack);
  const length = baseDuration > 0 ? baseDuration / speed : 0;
  return (
    <div className="flex flex-col gap-7">
      <div>
        <div className="flex items-baseline justify-between">
          <p className={groupLabelCls}>Speed &amp; length</p>
          <span className="text-sm tabular-nums text-slate">
            {speed.toFixed(2)}× · {length.toFixed(1)}s
          </span>
        </div>
        <input
          type="range"
          className="mt-3 h-1.5 w-full cursor-pointer accent-emerald"
          min={0.25}
          max={3}
          step={0.05}
          value={speed}
          aria-label="Playback speed and length"
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
        <div className="mt-1.5 flex justify-between text-[11px] text-slate">
          <span>Slower / longer</span>
          <span>Faster / shorter</span>
        </div>
      </div>

      <div className="border-t border-mist pt-6">
        <p className={groupLabelCls}>Options</p>
        <div className="mt-3">
          <FieldGroup fields={motionFields} values={values} onChange={onChange} def={def} emptyHint="No motion options." />
        </div>
      </div>

      <div className="border-t border-mist pt-6">
        <label className="flex items-center justify-between">
          <span className="text-sm font-semibold text-graphite">Sound effects</span>
          <button
            type="button"
            role="switch"
            aria-checked={sound}
            aria-label="Sound effects"
            onClick={() => setSound(!sound)}
            className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", sound ? "bg-primary" : "bg-mist")}
          >
            <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow-xs transition-transform", sound ? "translate-x-5" : "translate-x-0.5")} />
          </button>
        </label>
        <p className="mt-1.5 text-xs text-slate">Auto-matched to the motion — plays in the preview and is baked into MP4/WebM exports.</p>
        {sound && (
          <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Sound pack">
            {SOUND_PACKS.map((p) => {
              const active = p.id === soundPack;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSoundPack(p.id)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-colors",
                    active ? "border-primary-strong bg-emerald-tint text-ink" : "border-mist text-graphite hover:border-slate",
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {def.loopable && (
        <div className="border-t border-mist pt-6">
          <label className="flex items-center justify-between">
            <span className="text-sm font-semibold text-graphite">Loop</span>
            <button
              type="button"
              role="switch"
              aria-checked={loop}
              onClick={() => setLoop(!loop)}
              className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", loop ? "bg-primary" : "bg-mist")}
            >
              <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow-xs transition-transform", loop ? "translate-x-5" : "translate-x-0.5")} />
            </button>
          </label>
        </div>
      )}
    </div>
  );
}
