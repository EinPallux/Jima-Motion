import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LINKS = [
  { href: "#templates", label: "Templates" },
  { href: "#how", label: "How it works" },
  { href: "#why-free", label: "Why it's free" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all sm:px-5 ${
          scrolled ? "border border-mist bg-paper/80 shadow-[var(--shadow-card)] backdrop-blur-md" : "border border-transparent"
        }`}
      >
        <a href="#top" className="pl-1 font-display text-xl font-bold text-ink">
          jima <span className="text-ember">✦</span>
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-slate transition-colors hover:bg-porcelain hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
        <Link
          to="/studio"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper shadow-[0_8px_20px_rgba(16,16,20,0.18)] transition-transform hover:scale-[1.03] active:scale-100"
        >
          Open the Studio
        </Link>
      </nav>
    </header>
  );
}
