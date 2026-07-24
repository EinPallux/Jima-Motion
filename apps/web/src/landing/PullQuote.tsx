import type { ReactNode } from "react";
import { Container, Reveal } from "../ui";

/**
 * A big centered statement with an animated marker highlight inside — the
 * Jitter-style "no excuse to skip motion" beat between sections.
 */
export function PullQuote({ children, cite, className }: { children: ReactNode; cite?: string; className?: string }) {
  return (
    <section className={className ?? "bg-paper py-20 sm:py-28"}>
      <Container>
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="headline-xl font-display text-3xl font-extrabold leading-[1.08] text-ink sm:text-4xl lg:text-5xl">
            {children}
          </p>
          {cite && <p className="mt-7 text-sm font-bold uppercase tracking-[0.16em] text-muted">{cite}</p>}
        </Reveal>
      </Container>
    </section>
  );
}
