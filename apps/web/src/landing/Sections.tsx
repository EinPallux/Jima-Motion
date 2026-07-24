import type { ReactNode } from "react";
import { Card, Container, SectionHeading } from "../ui";

/** Shared 24×24 stroke icon shell — every feature glyph composes this. */
function IconBase({ className, children }: { className?: string | undefined; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
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

const STEPS = [
  { n: "1", title: "Pick a template", body: "Start from one of 249 professionally-animated templates." },
  { n: "2", title: "Type your words, drop your images", body: "Edit text, colors and images in a simple form — no timeline." },
  { n: "3", title: "Export MP4, WebM or GIF", body: "Rendered on your device in seconds. Download and post." },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-paper py-20 sm:py-24">
      <Container>
        <SectionHeading
          align="left"
          eyebrow="How it works"
          title="Three steps. About a minute."
          lead="No timeline. No keyframes. No tutorial needed."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {STEPS.map((s) => (
            <Card key={s.n} className="p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-tint font-display text-lg font-bold text-primary-strong">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-slate">{s.body}</p>
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
                    className={`rounded-t-xl p-3 font-display text-base font-bold ${
                      i === 0 ? "bg-emerald-tint text-primary-strong" : "text-slate"
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
                  <td className="p-3 font-medium text-graphite">{label}</td>
                  <td
                    className={`bg-emerald-tint p-3 font-semibold text-primary-strong ${
                      ri === ROWS.length - 1 ? "rounded-b-xl" : ""
                    }`}
                  >
                    {a}
                  </td>
                  <td className="p-3 text-slate">{b}</td>
                  <td className="p-3 text-slate">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}

const FEATURES = [
  { title: "Free forever", body: "No plans, no quotas, no upsell. Ever.", Icon: IconCheck },
  { title: "No account, ever", body: "The Studio just opens. Nothing to sign up for.", Icon: IconBolt },
  { title: "1080p, no watermark", body: "Clean, full-resolution exports every time.", Icon: IconBadge },
  { title: "MP4 + GIF (+ WebM)", body: "The formats social feeds and emails actually want.", Icon: IconFilm },
  { title: "Private by design", body: "Your text and images never leave your browser.", Icon: IconLock },
  { title: "Every aspect ratio", body: "1:1, 4:5, 9:16 and 16:9 from one project.", Icon: IconFrame },
];

export function Features() {
  return (
    <section className="bg-paper py-20 sm:py-24">
      <Container>
        <SectionHeading align="left" eyebrow="Features" title="Everything you need. Nothing you don't." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, ...f }) => (
            <Card key={f.title} className="p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-tint text-primary-strong">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{f.title}</h3>
              <p className="mt-1 text-slate">{f.body}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
