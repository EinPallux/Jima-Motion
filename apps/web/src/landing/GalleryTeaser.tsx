import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { templates } from "@jima/templates";
import { PosterThumb } from "../studio/components/PosterThumb";

export function GalleryTeaser() {
  const [category, setCategory] = useState("all");
  const categories = useMemo(() => ["all", ...new Set(templates.map((t) => t.category))], []);
  const shown = category === "all" ? templates : templates.filter((t) => t.category === category);

  return (
    <section id="templates" className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Templates for every post</h2>
        <Link to="/studio" className="text-sm font-semibold text-ember-text hover:underline">
          Open the full gallery in the Studio →
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={active}
              className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors ${active ? "bg-ink text-paper" : "bg-porcelain text-ink/70 hover:text-ink"}`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((def) => (
          <Link
            key={def.id}
            to={`/studio?t=${def.id}`}
            className="group block overflow-hidden rounded-[18px] border border-mist bg-paper shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1"
          >
            <PosterThumb def={def} aspect="1:1" paletteId={def.palettes[0]?.id} alt={def.name} className="w-full" />
            <div className="px-3 py-2.5">
              <p className="font-display text-sm font-bold text-ink">{def.name}</p>
              <p className="mt-0.5 text-xs text-slate">{def.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
