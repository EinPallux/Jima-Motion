// Font registry — maps template font *roles* to concrete families/weights,
// loads faces before render/export, and measures text for fitting.
//
// Critical gotcha (CLAUDE.md pitfalls): document.fonts.ready does NOT fetch
// unused faces. We must `document.fonts.load('<weight> <size> <family>', text)`
// per family+weight before drawing, or the first frame renders a fallback font.

export type FontRole = "display" | "body" | "serif" | "mono" | "script";

export interface FontFaceSpec {
  family: string;
  weights: number[];
}

export interface MeasureStyle {
  family: string;
  weight: number;
  size: number;
  letterSpacing?: number;
}

function cssFont(weight: number, size: number, family: string): string {
  // Quote the family to be safe with multi-word names ("Space Grotesk").
  return `${weight} ${size}px "${family}"`;
}

export class FontRegistry {
  private roles = new Map<FontRole, FontFaceSpec>();
  private measureCtx: CanvasRenderingContext2D | null = null;

  register(role: FontRole, spec: FontFaceSpec): this {
    this.roles.set(role, spec);
    return this;
  }

  spec(role: FontRole): FontFaceSpec {
    const s = this.roles.get(role);
    if (!s) throw new Error(`FontRegistry: role "${role}" is not registered`);
    return s;
  }

  family(role: FontRole): string {
    return this.spec(role).family;
  }

  /** Load one family+weight (idempotent; resolves when the face is usable). */
  async ensure(family: string, weight: number): Promise<void> {
    if (typeof document === "undefined" || !document.fonts) return;
    const spec = cssFont(weight, 64, family);
    try {
      await document.fonts.load(spec, "AaBbGg0123 äöüß");
    } catch {
      // Non-fatal: fall through; check() below will report reality.
    }
  }

  /** Load every registered role/weight. Call before first render + before export. */
  async ensureAll(): Promise<void> {
    const jobs: Promise<void>[] = [];
    for (const { family, weights } of this.roles.values()) {
      for (const w of weights) jobs.push(this.ensure(family, w));
    }
    await Promise.all(jobs);
  }

  /** True once the given face is actually loaded (never renders fallback silently). */
  isLoaded(family: string, weight: number): boolean {
    if (typeof document === "undefined" || !document.fonts) return true;
    return document.fonts.check(cssFont(weight, 64, family));
  }

  private ctx(): CanvasRenderingContext2D {
    if (this.measureCtx) return this.measureCtx;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("FontRegistry: 2D context unavailable for measuring");
    this.measureCtx = ctx;
    return ctx;
  }

  /** Pixel width of `text` at the given style (used by the fit helpers). */
  measure(text: string, style: MeasureStyle): number {
    const ctx = this.ctx();
    ctx.font = cssFont(style.weight, style.size, style.family);
    const base = ctx.measureText(text).width;
    if (style.letterSpacing && text.length > 1) {
      return base + style.letterSpacing * (text.length - 1);
    }
    return base;
  }
}

/** Default registry: display (Space Grotesk), body (Inter), serif (Fraunces). */
export function createDefaultFontRegistry(): FontRegistry {
  return new FontRegistry()
    .register("display", { family: "Space Grotesk", weights: [500, 700] })
    .register("body", { family: "Inter", weights: [400, 500, 600] })
    .register("serif", { family: "Fraunces", weights: [500, 600] });
}
