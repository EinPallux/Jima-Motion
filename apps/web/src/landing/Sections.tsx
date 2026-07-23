const STEPS = [
  { n: "1", title: "Pick a template", body: "Start from one of 155 professionally-animated templates.", grad: "from-ember to-candy" },
  { n: "2", title: "Type your words, drop your images", body: "Edit text, colors and images in a simple form — no timeline.", grad: "from-candy to-violet" },
  { n: "3", title: "Export MP4, WebM or GIF", body: "Rendered on your device in seconds. Download and post.", grad: "from-violet to-sky" },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Three steps.{" "}
        <span className="bg-gradient-to-r from-ember to-violet bg-clip-text text-transparent">About a minute.</span>
      </h2>
      <p className="mt-2 text-lg text-slate">No timeline. No keyframes. No tutorial needed.</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="rounded-[24px] border border-mist bg-paper p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-pop)]"
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${s.grad} font-display text-lg font-bold text-white shadow-sm`}
            >
              {s.n}
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-ink">{s.title}</h3>
            <p className="mt-1.5 text-slate">{s.body}</p>
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
            Free forever.{" "}
            <span className="bg-gradient-to-r from-ember to-violet bg-clip-text text-transparent">
              Here&rsquo;s why that&rsquo;s not a trick.
            </span>
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
                    className={`rounded-t-[12px] p-3 font-display text-base font-bold ${i === 0 ? "bg-ember text-ink" : "text-slate"}`}
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
  { icon: "✦", title: "Free forever", body: "No plans, no quotas, no upsell. Ever.", grad: "from-ember to-candy" },
  { icon: "⛆", title: "No account, ever", body: "The Studio just opens. Nothing to sign up for.", grad: "from-candy to-violet" },
  { icon: "◎", title: "1080p, no watermark", body: "Clean, full-resolution exports every time.", grad: "from-violet to-sky" },
  { icon: "▶", title: "MP4 + GIF (+ WebM)", body: "The formats social feeds and emails actually want.", grad: "from-sky to-ember" },
  { icon: "⚿", title: "Private by design", body: "Your text and images never leave your browser.", grad: "from-ember to-violet" },
  { icon: "◱", title: "Every aspect ratio", body: "1:1, 4:5, 9:16 and 16:9 from one project.", grad: "from-candy to-sky" },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-10 font-display text-3xl font-bold text-ink sm:text-4xl">
        Everything you need.{" "}
        <span className="bg-gradient-to-r from-ember to-violet bg-clip-text text-transparent">Nothing you don&rsquo;t.</span>
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-[24px] border border-mist bg-paper p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-pop)]"
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${f.grad} text-lg text-white shadow-sm`}
              aria-hidden
            >
              {f.icon}
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-ink">{f.title}</h3>
            <p className="mt-1 text-slate">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
