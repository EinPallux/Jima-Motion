import { Link } from "react-router-dom";

// Phase 0 placeholder. The full bold/animated landing (Three.js hero, live
// template rail) is built in Phase 5 — DESIGN_ARCHITECTURE.md §6.
export default function Landing() {
  return (
    <main className="min-h-[100dvh] bg-paper text-ink">
      <div className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col items-center justify-center gap-8 px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-ember-tint px-4 py-1.5 text-sm font-medium text-ember-text">
          <span aria-hidden>✦</span> Planning build — Phase 0
        </span>
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
          Motion graphics for social media.{" "}
          <span className="text-ember">In seconds.</span>
        </h1>
        <p className="max-w-xl text-lg text-slate">
          Pick a template, type your words, drop in your images — export an MP4 or GIF. 100% free,
          no account, no watermark. Nothing you make ever leaves your browser.
        </p>
        <Link
          to="/studio"
          className="rounded-[12px] bg-ember px-7 py-3.5 text-lg font-semibold text-ink shadow-[var(--shadow-pop)] transition-transform hover:scale-[1.02] active:scale-100"
        >
          Open the Studio
        </Link>
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate">
          <li>100% free</li>
          <li aria-hidden>·</li>
          <li>No account</li>
          <li aria-hidden>·</li>
          <li>No watermark</li>
          <li aria-hidden>·</li>
          <li>Private by design</li>
        </ul>
      </div>
    </main>
  );
}
