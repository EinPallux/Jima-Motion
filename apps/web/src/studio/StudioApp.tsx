import { useEffect, useMemo, useRef, useState } from "react";
import { templates } from "@jima/templates";
import type { TemplateDefinition } from "@jima/engine";
import { useStudio } from "./state/store";
import { Gallery } from "./gallery/Gallery";
import { Editor } from "./editor/Editor";
import { CapabilityFloor, hasWebGL2 } from "./CapabilityFloor";
import { clearProject, loadProject, resolveImageValues, saveProject, type PersistedProject } from "./state/persistence";

export function StudioApp() {
  const [supported] = useState(hasWebGL2);
  const def = useStudio((s) => s.def);
  const openTemplate = useStudio((s) => s.openTemplate);
  const close = useStudio((s) => s.close);
  const [resume, setResume] = useState<PersistedProject | null>(null);
  const allTemplates = useMemo(() => templates, []);

  // Deep-link (?t=<id>) and restore-on-load.
  useEffect(() => {
    if (!supported) return;
    const params = new URLSearchParams(location.search);
    const wanted = params.get("t");
    const saved = loadProject();
    setResume(saved);
    const target = wanted ? allTemplates.find((t) => t.id === wanted) : undefined;
    if (target) {
      // Restore saved edits if they belong to this template; else open defaults.
      if (saved && saved.templateId === target.id) {
        void resolveImageValues(saved.values).then((values) =>
          openTemplate(target, {
            aspect: saved.aspect,
            paletteId: saved.paletteId,
            font: saved.font,
            values,
            speed: saved.speed,
            loop: saved.loop,
          }),
        );
      } else {
        openTemplate(target);
      }
    }
  }, [supported, allTemplates, openTemplate]);

  // Keep ?t= in sync with the open template.
  useEffect(() => {
    const url = new URL(location.href);
    if (def) url.searchParams.set("t", def.id);
    else url.searchParams.delete("t");
    history.replaceState(null, "", url.toString());
  }, [def]);

  // Debounced autosave of the editable slice.
  const saveTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!supported) return;
    const unsub = useStudio.subscribe((s) => {
      if (!s.templateId) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        saveProject({
          templateId: s.templateId!,
          aspect: s.aspect,
          ...(s.paletteId ? { paletteId: s.paletteId } : {}),
          ...(s.font ? { font: s.font } : {}),
          values: s.values,
          speed: s.speed,
          loop: s.loop,
        });
      }, 500);
    });
    return () => {
      unsub();
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [supported]);

  if (!supported) return <CapabilityFloor />;

  if (def) {
    return <Editor def={def} templates={allTemplates} onBack={close} />;
  }

  return (
    <Gallery
      templates={allTemplates}
      resume={resume}
      onOpen={(t: TemplateDefinition) => openTemplate(t)}
      onResume={async () => {
        if (!resume) return;
        const target = allTemplates.find((t) => t.id === resume.templateId);
        if (!target) return;
        const values = await resolveImageValues(resume.values);
        openTemplate(target, {
          aspect: resume.aspect,
          paletteId: resume.paletteId,
          font: resume.font,
          values,
          speed: resume.speed,
          loop: resume.loop,
        });
      }}
      onDismissResume={() => {
        clearProject();
        setResume(null);
      }}
    />
  );
}
