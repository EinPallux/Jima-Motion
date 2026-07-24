import type { Aspect, TemplateDefinition } from "@jima/engine";
import { useStudio, canUndo, canRedo } from "../state/store";
import { categoryLabel } from "../gallery/groups";
import { Button, Badge, LeafMark } from "../../ui";

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
    <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-mist bg-paper px-3 py-2.5 sm:px-4">
      {/* Left: back + brand + current template */}
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-sm font-bold text-slate transition-colors hover:bg-subtle hover:text-ink"
        >
          <span aria-hidden className="text-base leading-none">←</span>
          <span className="hidden sm:inline">Templates</span>
        </button>
        <span aria-hidden className="hidden h-6 w-px bg-mist sm:block" />
        <a href="/" aria-label="Jima Motion home" className="hidden h-8 w-8 items-center justify-center rounded-lg bg-emerald-tint sm:flex">
          <LeafMark className="h-[18px] w-[18px]" />
        </a>
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-display text-[15px] font-bold text-ink">{def.name}</span>
          <Badge tone="neutral" className="hidden shrink-0 px-2 py-0.5 text-[11px] md:inline-flex">
            {categoryLabel(def.category)}
          </Badge>
        </div>
      </div>

      {/* Center-right: aspect segmented control */}
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
              className={`rounded-lg px-2.5 py-1.5 text-sm font-bold tabular-nums transition-colors sm:px-3 ${active ? "bg-paper text-ink shadow-xs" : "text-slate hover:text-ink"}`}
            >
              {ASPECT_LABEL[a]}
            </button>
          );
        })}
      </div>

      {/* Right: undo/redo + export */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={undo}
          disabled={!undoable}
          aria-label="Undo"
          title="Undo (⌘Z)"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-lg text-slate transition-colors hover:bg-subtle hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!redoable}
          aria-label="Redo"
          title="Redo (⌘⇧Z)"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-lg text-slate transition-colors hover:bg-subtle hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          ↷
        </button>
        <Button type="button" variant="primary" size="sm" className="ml-1" onClick={onExport}>
          Export ▸
        </Button>
      </div>
    </header>
  );
}
