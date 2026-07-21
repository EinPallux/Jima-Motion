const STEPS = [
  { n: "1", title: "Pick a template", body: "Start from one of 12 professionally-animated templates." },
  { n: "2", title: "Type your words, drop your images", body: "Edit text, colors and images in a simple form — no timeline." },
  { n: "3", title: "Export MP4 or GIF", body: "Rendered on your device in seconds. Download and post." },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Three steps. About a minute.</h2>
      <p className="mt-2 text-lg text-ink/70">No timeline. No keyframes. No tutorial needed.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="rounded-[20px] border border-mist bg-paper p-6 shadow-[var(--shadow-card)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ember-tint font-display text-lg font-bold text-ember-text">
              {s.n}
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-ink">{s.title}</h3>
            <p className="mt-1.5 text-ink/70">{s.body}</p>
          </div>
        ))}
      </div>
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
    <section id="why-free" className="bg-porcelain py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Free forever. Here's why that's not a trick.
          </h2>
          <p className="mt-4 text-lg text-ink/75">
            Video tools charge because rendering on their servers costs them money. Jima renders on
            your device instead — instant previews, no upload, no queue, no server bill. There's
            nothing to charge you for, so we don't. No account, no watermark, no "Pro" button hiding
            anywhere.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="p-3" />
                {COLS.map((c, i) => (
                  <th
                    key={c}
                    className={`rounded-t-[12px] p-3 font-display text-base font-bold ${i === 0 ? "bg-ember text-ink" : "text-ink/60"}`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, a, b, c], ri) => (
                <tr key={label} className="border-t border-mist">
                  <td className="p-3 font-medium text-ink/80">{label}</td>
                  <td className={`p-3 font-semibold text-ink ${ri === ROWS.length - 1 ? "rounded-b-[12px]" : ""} bg-ember-tint`}>{a}</td>
                  <td className="p-3 text-ink/70">{b}</td>
                  <td className="p-3 text-ink/70">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: "✦", title: "Free forever", body: "No plans, no quotas, no upsell. Ever." },
  { icon: "⛆", title: "No account, ever", body: "The Studio just opens. Nothing to sign up for." },
  { icon: "◎", title: "1080p, no watermark", body: "Clean, full-resolution exports every time." },
  { icon: "▶", title: "MP4 + GIF (+ WebM)", body: "The formats social feeds and emails actually want." },
  { icon: "⚿", title: "Private by design", body: "Your text and images never leave your browser." },
  { icon: "◱", title: "Every aspect ratio", body: "1:1, 4:5, 9:16 and 16:9 from one project." },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-[20px] border border-mist bg-paper p-6 shadow-[var(--shadow-card)]">
            <span className="text-2xl text-ember" aria-hidden>
              {f.icon}
            </span>
            <h3 className="mt-3 font-display text-lg font-bold text-ink">{f.title}</h3>
            <p className="mt-1 text-ink/70">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
