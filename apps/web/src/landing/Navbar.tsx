import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Wordmark, cn } from "../ui";

const LINKS = [
  { href: "#templates", label: "Templates" },
  { href: "#how", label: "How it works" },
  { href: "#why-free", label: "Why it's free" },
  { href: "#faq", label: "FAQ" },
];

// "Open the Studio" must stay a real <a> (role="link") — the landing smoke
// test and screen readers both look it up as a link, and nesting a <button>
// inside an <a> is invalid HTML besides. So it borrows the Button primitive's
// visual language (see ui/Button.tsx: variant="primary" size="md") instead of
// wrapping an actual <Button>.
const STUDIO_CTA =
  "inline-flex h-11 select-none items-center justify-center gap-2 rounded-xl bg-primary-strong px-5 text-[15px] font-bold text-white shadow-xs transition-all duration-150 hover:bg-primary-press active:translate-y-px";

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
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-200",
        scrolled ? "border-mist bg-paper/80 shadow-card backdrop-blur-md" : "border-transparent bg-paper",
      )}
    >
      <Container className="flex items-center justify-between gap-4 py-4">
        <a href="#top" className="flex items-center">
          <Wordmark className="text-xl" />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm font-bold text-slate transition-colors hover:bg-subtle hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <Link to="/studio" className={STUDIO_CTA}>
          Open the Studio
        </Link>
      </Container>
    </header>
  );
}
