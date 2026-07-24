import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Container, Wordmark } from "../ui";
import { Footer } from "./Footer";

/** Shared layout for the Terms / Privacy sub-pages — new light-mode SaaS chrome. */
export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  // These are standalone routes — start at the top, not wherever the user last scrolled.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-porcelain">
      <header className="sticky top-0 z-30 border-b border-mist bg-paper/85 backdrop-blur">
        <Container className="flex items-center justify-between py-3.5">
          <Link to="/" aria-label="Jima Motion — home" className="rounded-lg">
            <Wordmark className="text-xl" />
          </Link>
          <Link
            to="/studio"
            className="inline-flex h-9 items-center rounded-xl bg-primary-strong px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-press"
          >
            Open the Studio
          </Link>
        </Container>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
          <div className="text-sm font-bold uppercase tracking-[0.14em] text-primary-strong">Jima Motion</div>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-muted">Last updated: {updated}</p>
          <div className="mt-6 text-lg leading-relaxed text-slate">{intro}</div>
          <div className="mt-2">{children}</div>

          <div className="mt-14 border-t border-mist pt-6">
            <Link to="/" className="text-sm font-semibold text-primary-strong hover:text-primary-press">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/** Prose helpers — consistent typographic rhythm for the legal copy. */
export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-11 text-xl font-extrabold text-ink">{children}</h2>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 leading-relaxed text-slate">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="mt-4 flex flex-col gap-2.5">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 leading-relaxed text-slate">
      <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}
