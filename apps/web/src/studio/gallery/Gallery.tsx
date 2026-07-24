import { useMemo, useState } from "react";
import type { TemplateDefinition } from "@jima/engine";
import { TemplateCard } from "./TemplateCard";
import { GROUPS, groupOf } from "./groups";
import type { PersistedProject } from "../state/persistence";
import { Button, Card, LeafMark, Wordmark, cn } from "../../ui";

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

// A vibrant accent dot per group, so the category rail reads as a lively index
// rather than a flat list. Keys are group ids from groups.ts.
const GROUP_DOT: Record<string, string> = {
  all: "bg-primary-strong",
  text: "bg-indigo",
  overlays: "bg-coral",
  social: "bg-pink",
  product: "bg-amber",
  showcase: "bg-mint",
  explain: "bg-indigo",
  brand: "bg-coral",
  openers: "bg-amber",
  events: "bg-mint",
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

  // Count templates per group (for the rail badges).
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
  const activeGroup = group === "all" ? null : GROUPS.find((g) => g.id === group);
  const railItems = [{ id: "all", label: "All templates", blurb: "The whole library" }, ...activeGroups];

  return (
    <div className="flex min-h-[100dvh] bg-porcelain">
      {/* Persistent category rail (desktop). A real <nav> landmark. */}
      <aside className="sticky top-0 hidden h-[100dvh] w-64 shrink-0 flex-col border-r border-mist bg-paper xl:flex">
        <div className="flex items-center gap-2.5 border-b border-mist px-5 py-4">
          <a href="/" aria-label="Jima Motion home" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-tint">
              <LeafMark className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-ink">jima</span>
          </a>
        </div>

        <nav aria-label="Template categories" className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">Browse</p>
          <ul className="flex flex-col gap-0.5">
            {railItems.map((g) => {
              const active = g.id === group;
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setGroup(g.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-colors",
                      active ? "bg-ink text-paper" : "text-graphite hover:bg-subtle hover:text-ink",
                    )}
                  >
                    <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", GROUP_DOT[g.id] ?? "bg-slate", active && "ring-2 ring-paper/30")} />
                    <span className="min-w-0 flex-1 truncate">{g.label}</span>
                    <span className={cn("shrink-0 text-xs tabular-nums", active ? "text-paper/70" : "text-muted")}>
                      {g.id === "all" ? templates.length : counts.get(g.id) ?? 0}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-mist px-5 py-4">
          <p className="text-xs font-semibold leading-relaxed text-slate">
            <span className="text-primary-strong">100% free</span> · no account · nothing leaves your browser.
          </p>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Search bar — sticky, with the wordmark on mobile where the rail is hidden. */}
        <header className="sticky top-0 z-20 border-b border-mist bg-paper/85 px-4 py-3 backdrop-blur sm:px-6 xl:px-8">
          <div className="flex items-center gap-3">
            <a href="/" aria-label="Jima Motion home" className="flex items-center xl:hidden">
              <Wordmark className="text-lg" />
            </a>
            <div className="relative flex-1">
              <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                ⌕
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setQuery("");
                }}
                placeholder={`Search ${templates.length} templates by name, style or use-case…`}
                aria-label="Search templates"
                className="w-full rounded-full border border-mist bg-porcelain py-2.5 pl-10 pr-4 text-[15px] font-medium text-ink outline-none transition-colors focus:border-primary-strong focus:bg-paper focus:ring-2 focus:ring-emerald-ring"
              />
            </div>
            <span className="hidden shrink-0 text-sm font-semibold text-slate tabular-nums sm:inline" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </span>
          </div>

          {/* Category chips — mobile/tablet only (the rail replaces these on xl). */}
          <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-0.5 xl:hidden" role="group" aria-label="Filter by use-case">
            <Chip label="All" count={templates.length} tone="all" active={group === "all"} onClick={() => setGroup("all")} />
            {activeGroups.map((g) => (
              <Chip key={g.id} label={g.label} count={counts.get(g.id) ?? 0} tone={g.id} active={group === g.id} onClick={() => setGroup(g.id)} />
            ))}
          </div>
        </header>

        <main className="flex-1 px-4 pb-20 sm:px-6 xl:px-8">
          {resumeDef && resume && (
            <Card tone="amber" className="mt-6 flex flex-wrap items-center justify-between gap-3 p-5">
              <p className="text-sm text-ink">
                Continue where you left off — <span className="font-semibold">{resumeDef.name}</span>
                <span className="text-slate"> · {timeAgo(resume.updatedAt)}</span>
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={onResume}>
                  Resume
                </Button>
                <Button variant="ghost" size="sm" onClick={onDismissResume}>
                  Start fresh
                </Button>
              </div>
            </Card>
          )}

          <div className="flex flex-wrap items-end justify-between gap-4 pt-7">
            <div className="min-w-0">
              <h1 className="headline-xl font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Pick a template</h1>
              <p className="mt-2 max-w-xl text-base text-slate">
                {activeGroup ? (
                  <>
                    <span className="font-semibold text-graphite">{activeGroup.label}</span> — {activeGroup.blurb}. Hover any card to see it move.
                  </>
                ) : (
                  <>Hover any card to see it move. {templates.length} to choose from — every one free and fully editable.</>
                )}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-slate tabular-nums sm:hidden" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filtered.map((t) => (
                <TemplateCard key={t.id} def={t} onOpen={onOpen} />
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-bento border-2 border-dashed border-mist bg-paper py-16 text-center">
              <p className="text-base font-medium text-graphite">No templates match {q ? `“${query}”` : "this filter"}.</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setQuery("");
                  setGroup("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const CHIP_DOT: Record<string, string> = GROUP_DOT;

function Chip({
  label,
  count,
  tone,
  active,
  onClick,
}: {
  label: string;
  count: number;
  tone: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors",
        active ? "bg-ink text-paper shadow-xs" : "border border-mist bg-paper text-slate hover:bg-canvas hover:text-ink",
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", CHIP_DOT[tone] ?? "bg-slate")} />
      {label}
      <span className={cn("text-xs tabular-nums", active ? "text-paper/70" : "text-muted")}>{count}</span>
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
