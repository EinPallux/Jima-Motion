import { useMemo, useState } from "react";
import type { TemplateDefinition } from "@jima/engine";
import { TemplateCard } from "./TemplateCard";
import { GROUPS, groupOf, type TemplateGroup } from "./groups";
import type { PersistedProject } from "../state/persistence";

export function Gallery({
  templates,
  resume,
  onOpen,
  onResume,
  onDismissResume,
}: {
  templates: TemplateDefinition[];
  resume: PersistedProject | null;
  onOpen: (def: TemplateDefinition) => void;
  onResume: () => void;
  onDismissResume: () => void;
}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string>("all");

  // Templates bucketed by group, preserving registry order within each.
  const byGroup = useMemo(() => {
    const map = new Map<string, TemplateDefinition[]>();
    for (const t of templates) {
      const id = groupOf(t.category).id;
      let arr = map.get(id);
      if (!arr) {
        arr = [];
        map.set(id, arr);
      }
      arr.push(t);
    }
    return map;
  }, [templates]);

  // Only groups that actually have templates, in the curated order.
  const activeGroups = useMemo(
    () => GROUPS.filter((g) => (byGroup.get(g.id)?.length ?? 0) > 0),
    [byGroup],
  );

  const q = query.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!q) return null;
    return templates.filter(
      (t) => t.name.toLowerCase().includes(q) || t.tagline.toLowerCase().includes(q) || t.category.includes(q),
    );
  }, [q, templates]);

  const shownGroups: TemplateGroup[] = group === "all" ? activeGroups : activeGroups.filter((g) => g.id === group);

  const resumeDef = resume ? templates.find((t) => t.id === resume.templateId) : null;

  return (
    <div className="min-h-[100dvh] bg-porcelain">
      <header className="border-b border-mist bg-paper/85 px-4 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <a href="/" className="font-display text-xl font-bold text-ink">
            jima <span className="text-ember">✦</span>
          </a>
          <span className="text-sm text-slate">100% free · no account · nothing leaves your browser</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        {resumeDef && resume && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-mist bg-paper p-4">
            <p className="text-sm text-ink">
              Continue where you left off — <span className="font-semibold">{resumeDef.name}</span>
              <span className="text-slate"> · {timeAgo(resume.updatedAt)}</span>
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={onResume} className="rounded-[10px] bg-ember px-3 py-1.5 text-sm font-semibold text-ink">
                Resume
              </button>
              <button type="button" onClick={onDismissResume} className="rounded-[10px] px-3 py-1.5 text-sm font-medium text-slate hover:bg-mist">
                Start fresh
              </button>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h1 className="font-display text-3xl font-bold text-ink">Pick a template</h1>
            <span className="text-sm text-slate">{templates.length} templates</span>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates…"
            aria-label="Search templates"
            className="w-full max-w-sm rounded-[12px] border border-mist bg-paper px-4 py-2.5 text-[15px] outline-none focus:border-ember-text"
          />
          {!q && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by use-case">
              <GroupPill label="All" active={group === "all"} onClick={() => setGroup("all")} />
              {activeGroups.map((g) => (
                <GroupPill key={g.id} label={g.label} active={group === g.id} onClick={() => setGroup(g.id)} />
              ))}
            </div>
          )}
        </div>

        {/* Search view: flat results across every group. */}
        {q ? (
          searchResults && searchResults.length > 0 ? (
            <Grid items={searchResults} onOpen={onOpen} />
          ) : (
            <p className="py-12 text-center text-slate">No templates match “{query}”.</p>
          )
        ) : (
          <div className="flex flex-col gap-10">
            {shownGroups.map((g) => {
              const items = byGroup.get(g.id) ?? [];
              return (
                <section key={g.id} aria-label={g.label}>
                  <div className="mb-3 flex items-baseline gap-3">
                    <h2 className="font-display text-xl font-bold text-ink">{g.label}</h2>
                    <span className="text-sm text-slate">{g.blurb}</span>
                  </div>
                  <Grid items={items} onOpen={onOpen} />
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function GroupPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${active ? "bg-ink text-paper" : "bg-paper text-slate hover:text-ink"}`}
    >
      {label}
    </button>
  );
}

function Grid({ items, onOpen }: { items: TemplateDefinition[]; onOpen: (def: TemplateDefinition) => void }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((t) => (
        <TemplateCard key={t.id} def={t} onOpen={onOpen} />
      ))}
    </div>
  );
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}
