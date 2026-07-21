import { Link } from "react-router-dom";
import { clearProject } from "../studio/state/persistence";

export function Footer() {
  return (
    <footer className="border-t border-mist bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <div className="font-display text-xl font-bold text-ink">
            jima <span className="text-ember">✦</span>
          </div>
          <p className="mt-2 text-sm text-ink/70">
            Motion graphics for social media — 100% free, no account, rendered in your browser.
          </p>
          <p className="mt-3 text-xs text-ink/50">
            Made with the Jima engine — every animation on this page is a Jima template.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm">
          <nav className="flex flex-col gap-2" aria-label="Footer">
            <Link to="/studio" className="font-medium text-ink hover:text-ember-text">
              Open the Studio
            </Link>
            <a href="#templates" className="text-ink/70 hover:text-ink">
              Templates
            </a>
            <a href="#faq" className="text-ink/70 hover:text-ink">
              FAQ
            </a>
          </nav>
          <div className="flex flex-col gap-2">
            <span className="text-ink/70">Your work stays in your browser.</span>
            <button
              type="button"
              onClick={() => {
                clearProject();
                alert("Saved data cleared from this browser.");
              }}
              className="self-start text-ink/70 underline hover:text-ember-text"
            >
              Clear saved data
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
