import { useState } from "react";
import type { TemplateDefinition, TemplateField } from "@jima/engine";
import { useStudio } from "../state/store";
import { Field } from "../components/Field";

type Tab = "content" | "style" | "motion";

const CONTENT_TYPES = new Set(["text", "textarea", "textlist", "image"]);
const MOTION_TYPES = new Set(["select", "slider", "toggle"]);

export function Inspector({ def }: { def: TemplateDefinition }) {
  const [tab, setTab] = useState<Tab>("content");
  const values = useStudio((s) => s.values);
  const setValue = useStudio((s) => s.setValue);
  const reset = useStudio((s) => s.reset);

  const content = def.fields.filter((f) => CONTENT_TYPES.has(f.type));
  const colors = def.fields.filter((f) => f.type === "color");
  const motion = def.fields.filter((f) => MOTION_TYPES.has(f.type));

  return (
    <div className="flex h-full flex-col">
      <div role="tablist" aria-label="Editor panels" className="flex gap-1 border-b border-mist px-4 pt-3">
        <TabButton id="content" active={tab} onSelect={setTab} label="Content" />
        <TabButton id="style" active={tab} onSelect={setTab} label="Style" />
        <TabButton id="motion" active={tab} onSelect={setTab} label="Motion" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {tab === "content" && (
          <FieldGroup fields={content} values={values} onChange={setValue} def={def} emptyHint="This template has no text fields." />
        )}
        {tab === "style" && <StyleTab def={def} colors={colors} values={values} onChange={setValue} />}
        {tab === "motion" && <MotionTab def={def} motionFields={motion} values={values} onChange={setValue} />}
      </div>

      <div className="border-t border-mist px-4 py-3">
        <button
          type="button"
          onClick={reset}
          className="text-sm font-medium text-slate hover:text-ember-text"
        >
          ↺ Reset template
        </button>
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
      className={`rounded-t-[10px] px-3 py-2 text-sm font-semibold transition-colors ${isActive ? "border-b-2 border-ember text-ink" : "text-slate hover:text-ink"}`}
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
    <div className="flex flex-col gap-5">
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
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Palette</p>
        <div className="grid grid-cols-2 gap-2">
          {def.palettes.map((p) => {
            const active = p.id === paletteId;
            const swatches = Object.values(p.colors);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPalette(p.id)}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-[12px] border p-2 text-left transition-colors ${active ? "border-ember-text bg-ember-tint" : "border-mist hover:border-slate"}`}
              >
                <span className="flex overflow-hidden rounded-[6px] border border-mist">
                  {swatches.map((c, i) => (
                    <span key={i} className="h-6 w-3" style={{ background: c }} />
                  ))}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <FieldGroup fields={colors} values={values} onChange={onChange} def={def} emptyHint="No color options." />
    </div>
  );
}

function MotionTab({
  def,
  motionFields,
  values,
  onChange,
}: {
  def: TemplateDefinition;
  motionFields: TemplateField[];
  values: Record<string, unknown>;
  onChange: (key: string, v: unknown) => void;
}) {
  const speed = useStudio((s) => s.speed);
  const setSpeed = useStudio((s) => s.setSpeed);
  const loop = useStudio((s) => s.loop);
  const setLoop = useStudio((s) => s.setLoop);
  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-ink">Speed</span>
          <span className="text-sm tabular-nums text-slate">{speed.toFixed(2)}×</span>
        </div>
        <input
          type="range"
          className="mt-1.5 h-1.5 w-full cursor-pointer accent-ember"
          min={0.5}
          max={2}
          step={0.05}
          value={speed}
          aria-label="Playback speed"
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </div>

      <FieldGroup fields={motionFields} values={values} onChange={onChange} def={def} emptyHint="No motion options." />

      {def.loopable && (
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink">Loop</span>
          <button
            type="button"
            role="switch"
            aria-checked={loop}
            onClick={() => setLoop(!loop)}
            className={`relative h-6 w-11 rounded-full transition-colors ${loop ? "bg-ember" : "bg-mist"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow-sm transition-transform ${loop ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </label>
      )}
    </div>
  );
}
