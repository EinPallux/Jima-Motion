import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { templates } from "@jima/templates";
import { PosterThumb } from "../studio/components/PosterThumb";
import { GROUPS, groupOf } from "../studio/gallery/groups";
import { Container, SectionHeading } from "../ui";

const TEASER_LIMIT = 12;

// See Navbar.tsx for why this is a real <Link> styled like the Button
// primitive rather than a literal <Button> (role="link" + no
// nested-interactive markup).
const STUDIO_CTA =
  "inline-flex h-13 select-none items-center justify-center gap-2 rounded-xl bg-primary-strong px-7 text-base font-bold text-white shadow-xs transition-all duration-150 hover:bg-primary-press active:translate-y-px";

export function GalleryTeaser() {
  const [group, setGroup] = useState("all");
  const activeGroups = useMemo(() => {
    const present = new Set(templates.map((t) => groupOf(t.category).id));
    return GROUPS.filter((g) => present.has(g.id));
  }, []);
  const filtered = group === "all" ? templates : templates.filter((t) => groupOf(t.category).id === group);
  const shown = filtered.slice(0, TEASER_LIMIT);

  return (
    <section id="templates" className="bg-canvas py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Templates"
            eyebrowTone="indigo"
            title="Templates for every post"
            lead="Pick a starting point — every one is fully editable."
          />
          <Link to="/studio" className="text-sm font-bold text-primary-strong hover:underline">
            Open the full gallery in the Studio →
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {[{ id: "all", label: "All" }, ...activeGroups].map((g) => {
            const active = g.id === group;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGroup(g.id)}
                aria-pressed={active}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                  active ? "bg-ink text-paper" : "bg-paper text-slate ring-1 ring-inset ring-mist hover:text-ink"
                }`}
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
              className="group block overflow-hidden rounded-bento border border-mist bg-paper shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-pop"
            >
              <PosterThumb def={def} aspect="1:1" paletteId={def.palettes[0]?.id} alt={def.name} className="w-full" />
              <div className="px-3 py-2.5">
                <p className="font-display text-sm font-bold text-ink">{def.name}</p>
                <p className="mt-0.5 truncate text-xs text-slate">{def.tagline}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/studio" className={STUDIO_CTA}>
            Browse all {templates.length} templates
          </Link>
        </div>
      </Container>
    </section>
  );
}
