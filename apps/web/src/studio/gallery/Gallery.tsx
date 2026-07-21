import { useMemo, useState } from "react";
import type { TemplateDefinition } from "@jima/engine";
import { TemplateCard } from "./TemplateCard";
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
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set(templates.map((t) => t.category));
    return ["all", ...Array.from(set)];
  }, [templates]);

  const filtered = templates.filter((t) => {
    if (category !== "all" && t.category !== category) return false;
    if (query) {
      const q = query.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.tagline.toLowerCase().includes(q) || t.category.includes(q);
    }
    return true;
  });

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
          <h1 className="font-display text-3xl font-bold text-ink">Pick a template</h1>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates…"
            aria-label="Search templates"
            className="w-full max-w-sm rounded-[12px] border border-mist bg-paper px-4 py-2.5 text-[15px] outline-none focus:border-ember-text"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={active}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors ${active ? "bg-ink text-paper" : "bg-paper text-slate hover:text-ink"}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-slate">No templates match “{query}”.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <TemplateCard key={t.id} def={t} onOpen={onOpen} />
            ))}
          </div>
        )}
      </main>
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
