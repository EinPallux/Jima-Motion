import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export { cn } from "./cn";
export { Button, type ButtonProps } from "./Button";

/** Centered max-width page container. */
export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6", className)} {...props} />;
}

/** Elevated white surface. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-card border border-mist bg-paper shadow-card", className)}
      {...props}
    />
  );
}

/** Small status/label pill. Tones map to the emerald + neutral system. */
export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: "emerald" | "neutral" | "outline";
  className?: string;
  children: ReactNode;
}) {
  const tones: Record<string, string> = {
    emerald: "bg-emerald-tint text-primary-strong",
    neutral: "bg-subtle text-graphite",
    outline: "bg-paper text-slate ring-1 ring-inset ring-mist",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** The Jima wordmark — emerald leaf mark + Parkinsans wordmark. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display font-extrabold tracking-tight", className)}>
      <LeafMark className="h-[1.1em] w-[1.1em]" />
      <span className="text-ink">jima</span>
    </span>
  );
}

/** Emerald leaf/spark brand mark (inline SVG, currentColor-free). */
export function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path
        d="M12 2c3.9 3 8 5.4 8 11a8 8 0 1 1-16 0C4 7.4 8.1 5 12 2Z"
        fill="url(#leaf)"
      />
      <path d="M12 7.5v10M12 12.5l3-2.2M12 15l-2.6-1.9" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
      <defs>
        <linearGradient id="leaf" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Section eyebrow + heading + optional lead, centered by default. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      {eyebrow && (
        <div className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-primary-strong">{eyebrow}</div>
      )}
      <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">{title}</h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-slate">{lead}</p>}
    </div>
  );
}
