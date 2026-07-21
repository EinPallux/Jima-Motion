import type { TemplateDefinition } from "@jima/engine";
import { PosterThumb } from "../components/PosterThumb";

export function TemplateRail({
  templates,
  currentId,
  onSelect,
}: {
  templates: TemplateDefinition[];
  currentId: string;
  onSelect: (def: TemplateDefinition) => void;
}) {
  return (
    <nav aria-label="Templates" className="hidden w-[76px] shrink-0 flex-col gap-2 overflow-y-auto border-r border-mist bg-paper p-2 lg:flex">
      {templates.map((t) => {
        const active = t.id === currentId;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t)}
            aria-current={active}
            title={t.name}
            className={`overflow-hidden rounded-[12px] border-2 transition-colors ${active ? "border-ember" : "border-transparent hover:border-mist"}`}
          >
            <PosterThumb def={t} aspect={t.defaultAspect} paletteId={t.palettes[0]?.id} alt={t.name} className="w-full rounded-[9px]" />
          </button>
        );
      })}
    </nav>
  );
}
