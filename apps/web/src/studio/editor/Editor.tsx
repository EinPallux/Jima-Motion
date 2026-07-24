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
  const font = useStudio((s) => s.font);
  const speed = useStudio((s) => s.speed);
  const loop = useStudio((s) => s.loop);
  const sound = useStudio((s) => s.sound);
  const soundPack = useStudio((s) => s.soundPack);
  const openTemplate = useStudio((s) => s.openTemplate);
  const undo = useStudio((s) => s.undo);
  const redo = useStudio((s) => s.redo);
  const reduced = useReducedMotion();
  const caps = useCapabilities();

  const containerRef = useRef<HTMLDivElement>(null);
  const preview = usePreview(containerRef, { def, aspect, values, paletteId, font, speed, loop, sound, soundPack, reducedMotion: reduced });
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
        // Inside a text field, let the browser's native per-character undo win.
        if (editable) return;
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (editable) return;
      // Don't hijack Space/Arrows/Home destined for a focused interactive control
      // (buttons, radios, switches, sliders, links activate/navigate with these
      // keys themselves) — only drive playback when focus is elsewhere.
      if (el.closest('button, a, [role="radio"], [role="switch"], [role="slider"], [role="tab"], [role="menuitem"], summary')) return;
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
          <Inspector def={def} baseDuration={preview.duration} />
        </aside>
      </div>

      {exportOpen && <ExportModal def={def} caps={caps} onClose={() => setExportOpen(false)} />}
    </div>
  );
}
