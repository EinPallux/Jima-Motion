import { useEffect, useRef, useState } from "react";
import type { TemplateDefinition } from "@jima/engine";
import { useStudio } from "../state/store";
import { usePreview } from "../hooks/usePreview";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useCapabilities } from "../hooks/useCapabilities";
import { Topbar } from "./Topbar";
import { TemplateRail } from "./TemplateRail";
import { PreviewStage } from "./PreviewStage";
import { Inspector } from "./Inspector";
import { ExportModal } from "./ExportModal";

export function Editor({
  def,
  templates,
  onBack,
}: {
  def: TemplateDefinition;
  templates: TemplateDefinition[];
  onBack: () => void;
}) {
  const aspect = useStudio((s) => s.aspect);
  const values = useStudio((s) => s.values);
  const paletteId = useStudio((s) => s.paletteId);
  const speed = useStudio((s) => s.speed);
  const loop = useStudio((s) => s.loop);
  const openTemplate = useStudio((s) => s.openTemplate);
  const undo = useStudio((s) => s.undo);
  const redo = useStudio((s) => s.redo);
  const reduced = useReducedMotion();
  const caps = useCapabilities();

  const containerRef = useRef<HTMLDivElement>(null);
  const preview = usePreview(containerRef, { def, aspect, values, paletteId, speed, loop, reducedMotion: reduced });
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement;
      const editable = el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable;
      const mod = e.metaKey || e.ctrlKey;

      if (exportOpen) {
        if (e.key === "Escape") setExportOpen(false);
        return;
      }
      if (mod && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setExportOpen(true);
        return;
      }
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (editable) return;
      if (e.key === " ") {
        e.preventDefault();
        preview.toggle();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        preview.stepFrame(1, e.shiftKey);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        preview.stepFrame(-1, e.shiftKey);
      } else if (e.key === "Home") {
        e.preventDefault();
        preview.restart();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview, exportOpen, undo, redo]);

  return (
    <div className="flex h-[100dvh] flex-col bg-porcelain">
      <Topbar def={def} onBack={onBack} onExport={() => setExportOpen(true)} />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <TemplateRail templates={templates} currentId={def.id} onSelect={(t) => openTemplate(t)} />
        <PreviewStage containerRef={containerRef} preview={preview} />
        <aside className="flex max-h-[46vh] w-full shrink-0 flex-col border-t border-mist bg-paper lg:max-h-none lg:w-[360px] lg:border-l lg:border-t-0">
          <Inspector def={def} />
        </aside>
      </div>

      {exportOpen && <ExportModal def={def} caps={caps} onClose={() => setExportOpen(false)} />}
    </div>
  );
}
