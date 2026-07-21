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
    <header
      className={`sticky top-0 z-40 transition-colors ${scrolled ? "border-b border-mist bg-paper/80 backdrop-blur" : "bg-transparent"}`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <a href="#top" className="font-display text-xl font-bold text-ink">
          jima <span className="text-ember">✦</span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-ink/70 transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </div>
        <Link
          to="/studio"
          className="rounded-[12px] bg-ember px-4 py-2 text-sm font-semibold text-ink shadow-[var(--shadow-pop)] transition-transform hover:scale-[1.03] active:scale-100"
        >
          Open the Studio
        </Link>
      </nav>
    </header>
  );
}
