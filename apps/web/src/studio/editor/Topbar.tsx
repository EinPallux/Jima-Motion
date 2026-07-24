import type { Aspect, TemplateDefinition } from "@jima/engine";
import { useStudio, canUndo, canRedo } from "../state/store";
import { Button, Wordmark } from "../../ui";

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
      <Button type="button" variant="ghost" size="sm" onClick={onBack}>
        ← Templates
      </Button>

      <div className="flex min-w-0 items-center gap-2">
        <Wordmark className="text-lg" />
        <span className="hidden truncate text-sm text-slate sm:inline">/ {def.name}</span>
      </div>

      <div role="radiogroup" aria-label="Aspect ratio" className="ml-auto flex gap-1 rounded-xl bg-subtle p-1">
        {def.aspects.map((a) => {
          const active = a === aspect;
          return (
            <button
              key={a}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setAspect(a)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold tabular-nums transition-colors ${active ? "bg-primary-strong text-white shadow-xs" : "text-slate hover:text-ink"}`}
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
          className="rounded-xl px-2 py-1.5 text-slate transition-colors hover:bg-subtle hover:text-ink disabled:pointer-events-none disabled:opacity-45"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!redoable}
          aria-label="Redo"
          className="rounded-xl px-2 py-1.5 text-slate transition-colors hover:bg-subtle hover:text-ink disabled:pointer-events-none disabled:opacity-45"
        >
          ↷
        </button>
      </div>

      <Button type="button" variant="primary" size="sm" onClick={onExport}>
        Export ▸
      </Button>
    </header>
  );
}
