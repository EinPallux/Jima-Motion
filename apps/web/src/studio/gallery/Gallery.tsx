import { useMemo, useState } from "react";
import type { TemplateDefinition } from "@jima/engine";
import { TemplateCard } from "./TemplateCard";
import { GROUPS, groupOf } from "./groups";
import type { PersistedProject } from "../state/persistence";

// Concept keywords per category so natural searches match intent, not just the
// literal name/tagline (e.g. "lower third", "caption", "background", "intro").
const CATEGORY_KEYWORDS: Record<string, string> = {
  overlay: "overlay lower third lower-third nametag name tag caption subtitle callout banner transparent alpha broadcast chyron",
  intro: "intro opener stinger countdown logo reveal channel opening title card",
  statement: "text title headline typography kinetic type quote words",
  announcement: "announcement headline text title",
  social: "social instagram tiktok youtube reel story follow like subscribe hashtag mention poll comment chat dm search",
  product: "product ecommerce shop store item price feature watermark",
  promo: "promo sale discount offer deal coupon price shipping",
  stat: "stat data chart number percentage graph metric counter progress rating",
  educational: "explainer steps how-to tutorial process timeline",
  comparison: "compare comparison versus vs before after",
  testimonial: "testimonial review quote rating stars customer",
  brand: "brand logo end card thank you outro",
  event: "event date invite save the date lineup schedule",
  travel: "travel trip location postcard destination",
  photo: "photo image picture gallery grid",
  tech: "tech app device mockup screen phone",
  showcase: "showcase gallery feature spotlight present",
};

function searchText(t: TemplateDefinition): string {
  return `${t.name} ${t.tagline} ${t.category} ${groupOf(t.category).label} ${CATEGORY_KEYWORDS[t.category] ?? ""}`.toLowerCase();
}

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

  // Count templates per group (for the filter chips).
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const t of templates) {
      const id = groupOf(t.category).id;
      m.set(id, (m.get(id) ?? 0) + 1);
    }
    return m;
  }, [templates]);

  // Only groups that actually have templates, in the curated order.
  const activeGroups = useMemo(() => GROUPS.filter((g) => (counts.get(g.id) ?? 0) > 0), [counts]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    const terms = q ? q.split(/\s+/).filter(Boolean) : [];
    return templates.filter((t) => {
      if (group !== "all" && groupOf(t.category).id !== group) return false;
      if (terms.length === 0) return true;
      const hay = searchText(t);
      return terms.every((term) => hay.includes(term));
    });
  }, [templates, group, q]);

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

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-8">
        {resumeDef && resume && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-mist bg-paper p-4">
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

        <div className="pt-7">
          <h1 className="font-display text-3xl font-bold text-ink">Pick a template</h1>
          <p className="mt-1 text-slate">Hover any template to see it move. {templates.length} to choose from — all free.</p>
        </div>

        {/* Sticky filter toolbar: search + category chips + result count. */}
        <div className="sticky top-0 z-20 -mx-4 mt-5 border-b border-mist bg-porcelain/90 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full max-w-sm">
                <span aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate">⌕</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setQuery("");
                  }}
                  placeholder="Search templates… (name, style, or use-case)"
                  aria-label="Search templates"
                  className="w-full rounded-full border border-mist bg-paper py-2.5 pl-9 pr-4 text-[15px] outline-none focus:border-ember-text"
                />
              </div>
              <span className="text-sm text-slate" aria-live="polite">
                {filtered.length} {filtered.length === 1 ? "template" : "templates"}
              </span>
            </div>

            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5" role="group" aria-label="Filter by use-case">
              <Chip label="All" count={templates.length} active={group === "all"} onClick={() => setGroup("all")} />
              {activeGroups.map((g) => (
                <Chip key={g.id} label={g.label} count={counts.get(g.id) ?? 0} active={group === g.id} onClick={() => setGroup(g.id)} />
              ))}
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((t) => (
              <TemplateCard key={t.id} def={t} onOpen={onOpen} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-slate">
              No templates match {q ? `“${query}”` : "this filter"}.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setGroup("all");
              }}
              className="mt-3 rounded-full border border-mist bg-paper px-4 py-2 text-sm font-medium text-ink hover:bg-mist"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function Chip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-ink text-paper" : "border border-mist bg-paper text-slate hover:text-ink"
      }`}
    >
      {label}
      <span className={`text-xs ${active ? "text-paper/80" : "text-slate"}`}>{count}</span>
    </button>
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
