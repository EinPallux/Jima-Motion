import { Link } from "react-router-dom";
import { clearProject } from "../studio/state/persistence";
import { Container, Wordmark } from "../ui";

export function Footer() {
  return (
    <footer className="border-t border-mist bg-paper">
      <Container className="flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <Wordmark className="text-xl" />
          <p className="mt-3 text-sm text-slate">100% free · no account · nothing leaves your browser.</p>
          <p className="mt-3 text-xs text-slate">
            Made with the Jima engine — every animation on this page is a Jima template.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm">
          <nav className="flex flex-col gap-2" aria-label="Footer">
            <Link to="/studio" className="font-medium text-ink hover:text-primary-strong">
              Open the Studio
            </Link>
            <a href="/#templates" className="text-slate hover:text-ink">
              Templates
            </a>
            <a href="/#faq" className="text-slate hover:text-ink">
              FAQ
            </a>
          </nav>
          <nav className="flex flex-col gap-2" aria-label="Legal">
            <Link to="/privacy" className="text-slate hover:text-ink">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate hover:text-ink">
              Terms of Service
            </Link>
          </nav>
          <div className="flex flex-col gap-2">
            <span className="text-slate">Your work stays in your browser.</span>
            <button
              type="button"
              onClick={() => {
                clearProject();
                alert("Saved data cleared from this browser.");
              }}
              className="self-start text-slate underline hover:text-primary-strong"
            >
              Clear saved data
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
