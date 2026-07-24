import type { ReactElement, ReactNode } from "react";
import { BentoCard, Container, Reveal, SectionHeading, type Tone } from "../ui";

/** Shared 24×24 stroke icon shell — every feature glyph composes this. */
function IconBase({ className, children }: { className?: string | undefined; children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
const IconCheck = ({ className }: { className?: string }) => <IconBase className={className}><path d="M5 12.5l4.5 4.5L19 7" /></IconBase>;
const IconBolt = ({ className }: { className?: string }) => <IconBase className={className}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" stroke="none" /></IconBase>;
const IconBadge = ({ className }: { className?: string }) => <IconBase className={className}><circle cx="12" cy="12" r="8" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></IconBase>;
const IconFilm = ({ className }: { className?: string }) => <IconBase className={className}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M10 9.3v5.4l4.7-2.7Z" fill="currentColor" stroke="none" /></IconBase>;
const IconLock = ({ className }: { className?: string }) => <IconBase className={className}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></IconBase>;
const IconFrame = ({ className }: { className?: string }) => <IconBase className={className}><path d="M7 3.5v3.5M3.5 7H7M17 3.5v3.5M20.5 7H17M7 20.5v-3.5M3.5 17H7M17 20.5v-3.5M20.5 17H17" /></IconBase>;

// ---- From idea to export (three vibrant step cards) ----
const STEPS: { n: string; title: string; body: string; tone: Tone; chip: string }[] = [
  { n: "1", title: "Pick a template", body: "Start from one of hundreds of professionally-animated designs — every category, every aspect ratio.", tone: "mint", chip: "bg-mint" },
  { n: "2", title: "Make it yours", body: "Type your words, drop in images, tweak colors and fonts in a simple form. No timeline, no keyframes.", tone: "amber", chip: "bg-amber" },
  { n: "3", title: "Export & post", body: "Render an MP4, WebM or GIF on your own device in seconds. Download it and you're done.", tone: "coral", chip: "bg-coral" },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-paper py-20 sm:py-28">
      <Container>
        <SectionHeading align="center" eyebrow="How it works" eyebrowTone="mint" size="lg" title="From idea to export in about a minute." lead="Three steps. No tutorial, no learning curve, no account." />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <BentoCard tone={s.tone} className="h-full border-2 border-ink">
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.chip} font-display text-2xl font-extrabold text-ink`}>{s.n}</span>
                <h3 className="mt-6 font-display text-2xl font-extrabold text-ink">{s.title}</h3>
                <p className="mt-2.5 font-medium text-graphite">{s.body}</p>
              </BentoCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ---- Why it's free (bold statement + comparison) ----
const COLS = ["Jima Motion", "Typical motion tools", "All-in-one suites"];
const ROWS: [string, string, string, string][] = [
  ["Price for a clean 1080p export", "$0", "$16–19/mo", "Freemium upsell"],
  ["Account required", "Never", "To save & export", "Yes"],
  ["Watermark on free", "Never", "Yes", "On premium assets"],
  ["Export limits", "None", "720p cap on free", "Varies"],
  ["Where your files go", "Your browser", "Their servers", "Their servers"],
  ["GIF export", "Yes, free", "Sometimes", "Limited"],
];

export function WhyFree() {
  return (
    <section id="why-free" className="bg-canvas py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <Reveal>
          <SectionHeading align="left" eyebrow="Why it's free" eyebrowTone="emerald" size="lg" title="Free forever. Here's why that's not a trick." lead={
            <>Video tools charge because rendering on their servers costs money. Jima renders on <em className="not-italic font-bold text-ink">your</em> device — instant previews, no upload, no queue, no server bill. There&rsquo;s nothing to charge you for, so we don&rsquo;t.</>
          } />
        </Reveal>
        <Reveal delay={100} className="overflow-x-auto rounded-bento border-2 border-ink bg-paper p-2 shadow-bold sm:p-4">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="p-3" />
                {COLS.map((c, i) => (
                  <th key={c} className={`p-3 font-display text-base font-extrabold ${i === 0 ? "rounded-t-xl bg-primary-strong text-white" : "text-slate"}`}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, a, b, c], ri) => (
                <tr key={label} className="border-t border-mist">
                  <td className="p-3 font-bold text-graphite">{label}</td>
                  <td className={`bg-emerald-tint p-3 font-extrabold text-primary-strong ${ri === ROWS.length - 1 ? "rounded-b-xl" : ""}`}>{a}</td>
                  <td className="p-3 font-medium text-slate">{b}</td>
                  <td className="p-3 font-medium text-slate">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Container>
    </section>
  );
}

// ---- Everything you need (bento grid) ----
type Feat = { title: string; body: string; Icon: (p: { className?: string }) => ReactElement; tone: Tone; chip: string; iconColor: string; wide?: boolean };
const FEATURES: Feat[] = [
  { title: "Free forever", body: "No plans, no quotas, no upsell — anywhere, ever. The Studio just opens and everything works.", Icon: IconCheck, tone: "emerald", chip: "bg-emerald", iconColor: "text-ink", wide: true },
  { title: "No account", body: "Nothing to sign up for.", Icon: IconBolt, tone: "amber", chip: "bg-amber-tint", iconColor: "text-ink" },
  { title: "1080p, no watermark", body: "Clean, full-res exports.", Icon: IconBadge, tone: "coral", chip: "bg-coral-tint", iconColor: "text-ink" },
  { title: "MP4, WebM & GIF", body: "The formats social feeds and email actually want — plus transparent WebM to drop on footage.", Icon: IconFilm, tone: "indigo", chip: "bg-indigo-tint", iconColor: "text-indigo", wide: true },
  { title: "Private by design", body: "Your text & images never leave the browser.", Icon: IconLock, tone: "pink", chip: "bg-pink-tint", iconColor: "text-ink" },
  { title: "Every aspect ratio", body: "1:1, 4:5, 9:16 and 16:9 from one project.", Icon: IconFrame, tone: "mint", chip: "bg-mint-tint", iconColor: "text-ink" },
];

export function Features() {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <Container>
        <SectionHeading align="center" eyebrow="Features" eyebrowTone="coral" size="lg" title="Everything you need. Nothing you don't." />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, ...f }, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80} className={f.wide ? "sm:col-span-2" : ""}>
              <BentoCard tone={f.tone} className="h-full">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.chip} ${f.iconColor}`}><Icon className="h-6 w-6" /></span>
                <h3 className="mt-6 font-display text-xl font-extrabold text-ink">{f.title}</h3>
                <p className="mt-1.5 font-medium text-graphite">{f.body}</p>
              </BentoCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
