import { Link } from "react-router-dom";

// Phase 0 placeholder. The full Studio (gallery, form editor, preview, export
// modal) is built in Phase 3 — DESIGN_ARCHITECTURE.md §7.
export default function Studio() {
  return (
    <main className="min-h-[100dvh] bg-porcelain text-ink">
      <header className="flex items-center justify-between border-b border-mist bg-paper/80 px-6 py-4 backdrop-blur">
        <Link to="/" className="font-display text-xl font-bold">
          jima <span className="text-ember">✦</span>
        </Link>
        <span className="text-sm text-slate">the Studio</span>
      </header>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">The Studio is coming together.</h1>
        <p className="text-slate">
          The motion engine and export pipeline land first (Phases 1–2); the gallery and editor UI
          arrive in Phase 3.
        </p>
      </div>
    </main>
  );
}
