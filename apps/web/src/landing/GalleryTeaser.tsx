import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { templates } from "@jima/templates";
import { PosterThumb } from "../studio/components/PosterThumb";
import { GROUPS, groupOf } from "../studio/gallery/groups";

const TEASER_LIMIT = 12;

export function GalleryTeaser() {
  const [group, setGroup] = useState("all");
  const activeGroups = useMemo(() => {
    const present = new Set(templates.map((t) => groupOf(t.category).id));
    return GROUPS.filter((g) => present.has(g.id));
  }, []);
  const filtered = group === "all" ? templates : templates.filter((t) => groupOf(t.category).id === group);
  const shown = filtered.slice(0, TEASER_LIMIT);

  return (
    <section id="templates" className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Templates for every post</h2>
        <Link to="/studio" className="text-sm font-semibold text-ember-text hover:underline">
          Open the full gallery in the Studio →
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[{ id: "all", label: "All" }, ...activeGroups].map((g) => {
          const active = g.id === group;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              aria-pressed={active}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${active ? "bg-ink text-paper" : "bg-porcelain text-slate hover:text-ink"}`}
            >
              {g.label}
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
