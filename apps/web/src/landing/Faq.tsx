import { useState } from "react";

const FAQ: { q: string; a: string }[] = [
  {
    q: "Is it really 100% free? What's the catch?",
    a: "Yes, and there isn't one. Jima renders everything on your own device, so there are no server bills to cover — no account, no watermark, no upsell hiding anywhere.",
  },
  { q: "Do I need an account?", a: "No. There's no login to create — the Studio just opens." },
  {
    q: "Can I use the videos commercially?",
    a: "Yes. Everything you export is yours, for any use. The templates and fonts are licensed for it.",
  },
  {
    q: "Where are my text and images stored?",
    a: "Only in your browser (autosave). We never receive them — there's no server that could.",
  },
  {
    q: "What can I export?",
    a: "MP4 or WebM video and GIF, up to 1080p / 60 fps, in 1:1, 4:5, 9:16 and 16:9.",
  },
  {
    q: "Which browsers work best?",
    a: "Chrome, Edge and Safari 16.4+ do everything; Firefox exports WebM and GIF today. GIF works everywhere.",
  },
  {
    q: "How is this different from Canva or Jitter?",
    a: "They're bigger tools with accounts, watermarks or paid tiers on the way to a clean export. Jima does one job — animated posts from templates — with zero friction.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-porcelain py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Questions</h2>
        <div className="mt-8 flex flex-col gap-3">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="overflow-hidden rounded-[16px] border border-mist bg-paper">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-display text-lg font-semibold text-ink">{item.q}</span>
                  <span className={`shrink-0 text-ember transition-transform ${isOpen ? "rotate-45" : ""}`} aria-hidden>
                    +
                  </span>
                </button>
                {isOpen && <p className="px-5 pb-5 text-ink/75">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
