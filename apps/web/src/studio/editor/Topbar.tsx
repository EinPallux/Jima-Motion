import type { Aspect, TemplateDefinition } from "@jima/engine";
import { useStudio, canUndo, canRedo } from "../state/store";

const ASPECT_LABEL: Record<Aspect, string> = {
  "1:1": "1:1",
  "4:5": "4:5",
  "9:16": "9:16",
  "16:9": "16:9",
};

export function Topbar({
  def,
  onBack,
  onExport,
}: {
  def: TemplateDefinition;
  onBack: () => void;
  onExport: () => void;
}) {
  const aspect = useStudio((s) => s.aspect);
  const setAspect = useStudio((s) => s.setAspect);
  const undo = useStudio((s) => s.undo);
  const redo = useStudio((s) => s.redo);
  const undoable = useStudio(canUndo);
  const redoable = useStudio(canRedo);

  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-mist bg-paper px-4 py-2.5">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 rounded-[10px] px-2 py-1.5 text-sm font-medium text-slate hover:bg-mist hover:text-ink"
      >
        ← Templates
      </button>

      <div className="flex items-center gap-2">
        <span className="font-display text-lg font-bold text-ink">
          jima <span className="text-ember">✦</span>
        </span>
        <span className="hidden text-sm text-slate sm:inline">/ {def.name}</span>
      </div>

      <div role="radiogroup" aria-label="Aspect ratio" className="ml-auto flex gap-1 rounded-[12px] bg-porcelain p-1">
        {def.aspects.map((a) => {
          const active = a === aspect;
          return (
            <button
              key={a}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setAspect(a)}
              className={`rounded-[9px] px-2.5 py-1 text-sm font-medium tabular-nums transition-colors ${active ? "bg-paper text-ink shadow-[0_1px_3px_rgba(16,16,20,0.1)]" : "text-slate hover:text-ink"}`}
            >
              {ASPECT_LABEL[a]}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={undo}
          disabled={!undoable}
          aria-label="Undo"
          className="rounded-[10px] px-2 py-1.5 text-slate hover:bg-mist disabled:opacity-30"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!redoable}
          aria-label="Redo"
          className="rounded-[10px] px-2 py-1.5 text-slate hover:bg-mist disabled:opacity-30"
        >
          ↷
        </button>
      </div>

      <button
        type="button"
        onClick={onExport}
        className="rounded-[12px] bg-ember px-4 py-2 text-sm font-semibold text-ink shadow-[var(--shadow-pop)] transition-transform hover:scale-[1.03] active:scale-100"
      >
        Export ▸
      </button>
    </header>
  );
}
