import { Link } from "react-router-dom";
import { clearProject } from "../studio/state/persistence";
import { Container, LeafMark, Wordmark } from "../ui";

const COLUMNS: { title: string; links: { label: string; href: string; to?: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Templates", href: "/#templates" },
      { label: "How it works", href: "/#how" },
      { label: "Why it's free", href: "/#why-free" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Open the Studio", href: "/studio", to: "/studio" },
      { label: "Browse the gallery", href: "/studio", to: "/studio" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-mist bg-paper">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-tint">
                <LeafMark className="h-6 w-6" />
              </span>
              <Wordmark className="text-2xl" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate">
              100% free · no account · nothing leaves your browser. Every animation on this page is a
              Jima template, rendered by the Jima engine.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} className="flex flex-col gap-3" aria-label={col.title}>
              <h3 className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted">{col.title}</h3>
              {col.links.map((l) =>
                l.to ? (
                  <Link key={l.label} to={l.to} className="text-sm font-bold text-graphite hover:text-primary-strong">
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.label} href={l.href} className="text-sm font-bold text-graphite hover:text-primary-strong">
                    {l.label}
                  </a>
                ),
              )}
            </nav>
          ))}

          <nav className="flex flex-col gap-3" aria-label="Legal">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted">Legal</h3>
            <Link to="/privacy" className="text-sm font-bold text-graphite hover:text-primary-strong">Privacy Policy</Link>
            <Link to="/terms" className="text-sm font-bold text-graphite hover:text-primary-strong">Terms of Service</Link>
            <button
              type="button"
              onClick={() => {
                clearProject();
                alert("Saved data cleared from this browser.");
              }}
              className="self-start text-sm font-bold text-graphite underline decoration-mist underline-offset-4 hover:text-primary-strong"
            >
              Clear saved data
            </button>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-mist pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Jima Motion — free forever, made for social teams.</p>
          <p>Renders on your device. Nothing uploaded, ever.</p>
        </div>
      </Container>
    </footer>
  );
}
