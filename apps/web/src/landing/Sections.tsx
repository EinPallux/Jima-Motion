import type { ReactElement, ReactNode } from "react";
import { Card, Container, SectionHeading, type Tone } from "../ui";

/** Shared 24×24 stroke icon shell — every feature glyph composes this. */
function IconBase({ className, children }: { className?: string | undefined; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function IconCheck({ className }: { className?: string | undefined }) {
  return (
    <IconBase className={className}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </IconBase>
  );
}

function IconBolt({ className }: { className?: string | undefined }) {
  return (
    <IconBase className={className}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

function IconBadge({ className }: { className?: string | undefined }) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </IconBase>
  );
}

function IconFilm({ className }: { className?: string | undefined }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M10 9.3v5.4l4.7-2.7Z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

function IconLock({ className }: { className?: string | undefined }) {
  return (
    <IconBase className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </IconBase>
  );
}

function IconFrame({ className }: { className?: string | undefined }) {
  return (
    <IconBase className={className}>
      <path d="M7 3.5v3.5M3.5 7H7M17 3.5v3.5M20.5 7H17M7 20.5v-3.5M3.5 17H7M17 20.5v-3.5M20.5 17H17" />
    </IconBase>
  );
}

const STEPS: { n: string; title: string; body: string; tone: Tone; chip: string }[] = [
  { n: "1", title: "Pick a template", body: "Start from one of 274 professionally-animated templates.", tone: "mint", chip: "bg-mint" },
  { n: "2", title: "Type your words, drop your images", body: "Edit text, colors and images in a simple form — no timeline.", tone: "amber", chip: "bg-amber" },
  { n: "3", title: "Export MP4, WebM or GIF", body: "Rendered on your device in seconds. Download and post.", tone: "coral", chip: "bg-coral" },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-paper py-20 sm:py-24">
      <Container>
        <SectionHeading
          align="left"
          eyebrow="How it works"
          eyebrowTone="mint"
          title="Three steps. About a minute."
          lead="No timeline. No keyframes. No tutorial needed."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {STEPS.map((s) => (
            <Card key={s.n} tone={s.tone} bold className="p-7 transition-transform duration-200 hover:-translate-y-1">
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.chip} font-display text-2xl font-extrabold text-ink`}>
                {s.n}
              </span>
              <h3 className="mt-5 font-display text-xl font-extrabold text-ink">{s.title}</h3>
              <p className="mt-2 font-medium text-graphite">{s.body}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

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
    <section id="why-free" className="bg-canvas py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <SectionHeading
          align="left"
          eyebrow="Why it's free"
          eyebrowTone="emerald"
          title="Free forever. Here's why that's not a trick."
          lead={
            <>
              Video tools charge because rendering on their servers costs them money. Jima renders
              on your device instead — instant previews, no upload, no queue, no server bill.
              There&rsquo;s nothing to charge you for, so we don&rsquo;t. No account, no watermark,
              no &ldquo;Pro&rdquo; button hiding anywhere.
            </>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="p-3" />
                {COLS.map((c, i) => (
                  <th
                    key={c}
                    className={`p-3 font-display text-base font-extrabold ${
                      i === 0 ? "rounded-t-2xl bg-primary-strong text-white" : "text-slate"
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, a, b, c], ri) => (
                <tr key={label} className="border-t border-mist">
                  <td className="p-3 font-bold text-graphite">{label}</td>
                  <td
                    className={`bg-emerald-tint p-3 font-extrabold text-primary-strong ${
                      ri === ROWS.length - 1 ? "rounded-b-2xl" : ""
                    }`}
                  >
                    {a}
                  </td>
                  <td className="p-3 font-medium text-slate">{b}</td>
                  <td className="p-3 font-medium text-slate">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}

const FEATURES: { title: string; body: string; Icon: (p: { className?: string }) => ReactElement; chip: string; icon: string }[] = [
  { title: "Free forever", body: "No plans, no quotas, no upsell. Ever.", Icon: IconCheck, chip: "bg-emerald-tint", icon: "text-primary-strong" },
  { title: "No account, ever", body: "The Studio just opens. Nothing to sign up for.", Icon: IconBolt, chip: "bg-amber-tint", icon: "text-ink" },
  { title: "1080p, no watermark", body: "Clean, full-resolution exports every time.", Icon: IconBadge, chip: "bg-coral-tint", icon: "text-ink" },
  { title: "MP4 + GIF (+ WebM)", body: "The formats social feeds and emails actually want.", Icon: IconFilm, chip: "bg-indigo-tint", icon: "text-indigo" },
  { title: "Private by design", body: "Your text and images never leave your browser.", Icon: IconLock, chip: "bg-pink-tint", icon: "text-ink" },
  { title: "Every aspect ratio", body: "1:1, 4:5, 9:16 and 16:9 from one project.", Icon: IconFrame, chip: "bg-mint-tint", icon: "text-ink" },
];

export function Features() {
  return (
    <section className="bg-paper py-20 sm:py-24">
      <Container>
        <SectionHeading align="left" eyebrow="Features" eyebrowTone="coral" title="Everything you need. Nothing you don't." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, ...f }) => (
            <Card key={f.title} className="p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-pop">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.chip} ${f.icon}`}>
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-extrabold text-ink">{f.title}</h3>
              <p className="mt-1.5 font-medium text-slate">{f.body}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
