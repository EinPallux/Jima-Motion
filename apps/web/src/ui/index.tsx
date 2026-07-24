import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";
import { useInView } from "./useInView";

export { cn } from "./cn";
export { Button, type ButtonProps } from "./Button";
export { Reveal } from "./Reveal";
export { useInView } from "./useInView";

/** Vibrant color-block tones shared by Card, Badge and section bands (v3 bold look). */
export type Tone = "paper" | "emerald" | "coral" | "pink" | "amber" | "mint" | "indigo";

/** Tint background + matching hairline border per tone (dark ink text always ≥7:1). */
const CARD_TONES: Record<Tone, string> = {
  paper: "bg-paper border-mist",
  emerald: "bg-emerald-tint border-emerald/25",
  coral: "bg-coral-tint border-coral/30",
  pink: "bg-pink-tint border-pink/30",
  amber: "bg-amber-tint border-amber/35",
  mint: "bg-mint-tint border-mint/35",
  indigo: "bg-indigo-tint border-indigo/30",
};

/** Centered max-width page container. */
export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6", className)} {...props} />;
}

/**
 * Surface card. Defaults reproduce the old white card exactly; opt into a
 * vibrant `tone` tint and/or a chunky `bold` treatment (2px ink border + stacked
 * shadow) for the bold color-block look.
 */
export function Card({
  tone = "paper",
  bold = false,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: Tone; bold?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-card border",
        bold ? "border-2 border-ink shadow-bold" : cn(CARD_TONES[tone], "shadow-card"),
        // When bold, keep the tone's background but let the ink border dominate.
        bold && tone !== "paper" ? CARD_TONES[tone].split(" ")[0] : "",
        className,
      )}
      {...props}
    />
  );
}

const BADGE_TONES: Record<string, string> = {
  emerald: "bg-emerald-tint text-primary-strong",
  neutral: "bg-subtle text-graphite",
  outline: "bg-paper text-slate ring-1 ring-inset ring-mist",
  coral: "bg-coral-tint text-ink",
  pink: "bg-pink-tint text-ink",
  amber: "bg-amber-tint text-ink",
  mint: "bg-mint-tint text-ink",
  indigo: "bg-indigo-tint text-ink",
  ink: "bg-ink text-white",
};

/** Small status/label pill. Tones map to the emerald + vibrant + neutral system. */
export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: "emerald" | "neutral" | "outline" | "coral" | "pink" | "amber" | "mint" | "indigo" | "ink";
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
        BADGE_TONES[tone],
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

const EYEBROW_TONES: Record<string, string> = {
  emerald: "bg-emerald-tint text-primary-strong",
  coral: "bg-coral-tint text-ink",
  pink: "bg-pink-tint text-ink",
  amber: "bg-amber-tint text-ink",
  mint: "bg-mint-tint text-ink",
  indigo: "bg-indigo-tint text-ink",
};

/**
 * Section eyebrow (a bold color pill) + oversized heading + optional lead.
 * `size="lg"` bumps the heading for hero-adjacent sections.
 */
export function SectionHeading({
  eyebrow,
  eyebrowTone = "emerald",
  title,
  lead,
  align = "center",
  size = "md",
  className,
}: {
  eyebrow?: string;
  eyebrowTone?: "emerald" | "coral" | "pink" | "amber" | "mint" | "indigo";
  title: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl", className)}>
      {eyebrow && (
        <span
          className={cn(
            "mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em]",
            EYEBROW_TONES[eyebrowTone],
            align === "center" ? "mx-auto" : "",
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "headline-xl font-extrabold text-ink",
          size === "lg" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-[2.75rem]",
        )}
      >
        {title}
      </h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-slate">{lead}</p>}
    </div>
  );
}

type MarkerTone = "emerald" | "amber" | "coral" | "pink" | "mint" | "indigo";
const MARKER_BG: Record<MarkerTone, string> = {
  emerald: "bg-emerald",
  amber: "bg-amber",
  coral: "bg-coral",
  pink: "bg-pink",
  mint: "bg-mint",
  indigo: "bg-indigo",
};

/**
 * A word with an animated highlighter swipe behind it — the signature bold
 * accent. The colored bar wipes in the first time it scrolls into view. Dark
 * ink text stays ≥5:1 over every marker tone (they only cover the lower half).
 */
export function Marker({ children, tone = "emerald", className }: { children: ReactNode; tone?: MarkerTone; className?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.6 });
  return (
    <span ref={ref} className={cn("relative inline-block whitespace-nowrap", className)}>
      <span aria-hidden className={cn("marker-hl -rotate-1", MARKER_BG[tone], inView && "is-in")} />
      <span className="relative z-10">{children}</span>
    </span>
  );
}

/** A faux browser/app window frame with a traffic-light top bar. */
export function MockupFrame({
  url,
  children,
  className,
  barClassName,
}: {
  url?: string;
  children: ReactNode;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-bento border border-mist bg-paper shadow-pop", className)}>
      <div className={cn("flex items-center gap-1.5 border-b border-mist bg-canvas px-4 py-3", barClassName)} aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-mist" />
        <span className="h-2.5 w-2.5 rounded-full bg-mist" />
        <span className="h-2.5 w-2.5 rounded-full bg-mist" />
        {url && (
          <span className="ml-2 truncate rounded-full bg-paper px-3 py-1 text-xs font-medium text-slate ring-1 ring-inset ring-mist">
            {url}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/** A chunky bento tile — vibrant tint, oversized radius, hover-lift. */
export function BentoCard({
  tone = "paper",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: Tone }) {
  return (
    <div
      className={cn(
        "group/bento relative overflow-hidden rounded-bento border p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-bold",
        CARD_TONES[tone],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
