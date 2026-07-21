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

/**
 * Default registry: display (Space Grotesk), body (Inter), serif (Fraunces),
 * mono (JetBrains Mono).
 */
export function createDefaultFontRegistry(): FontRegistry {
  return new FontRegistry()
    .register("display", { family: "Space Grotesk", weights: [500, 700] })
    .register("body", { family: "Inter", weights: [400, 500, 600] })
    .register("serif", { family: "Fraunces", weights: [500, 600] })
    .register("mono", { family: "JetBrains Mono", weights: [400, 700] });
}

/** A user-selectable headline font. `family` must match the loaded @font-face. */
export interface FontChoice {
  id: string;
  label: string;
  family: string;
  kind: "sans" | "serif" | "mono";
}

/**
 * The headline fonts offered in the Studio's font picker. All OFL-1.1 and loaded
 * (weights 400–700) by the app + render harness, so a swap never renders a
 * fallback. `id` "default" keeps the template's built-in display font.
 */
export const FONT_CHOICES: FontChoice[] = [
  { id: "default", label: "Space Grotesk", family: "Space Grotesk", kind: "sans" },
  { id: "archivo", label: "Archivo", family: "Archivo", kind: "sans" },
  { id: "sora", label: "Sora", family: "Sora", kind: "sans" },
  { id: "poppins", label: "Poppins", family: "Poppins", kind: "sans" },
  { id: "outfit", label: "Outfit", family: "Outfit", kind: "sans" },
  { id: "fraunces", label: "Fraunces", family: "Fraunces", kind: "serif" },
  { id: "jetbrains", label: "JetBrains Mono", family: "JetBrains Mono", kind: "mono" },
];

export function fontChoice(id: string | undefined): FontChoice | undefined {
  return id ? FONT_CHOICES.find((f) => f.id === id) : undefined;
}

// Weights loaded for a swapped headline family so any template weight resolves.
const HEADLINE_WEIGHTS = [400, 500, 600, 700];

/**
 * A registry with the "display" (headline) role optionally swapped to a chosen
 * font. Body/serif/mono keep their defaults. Used by the Studio + export so a
 * project's headline font follows the whole template.
 */
export function createFontRegistry(opts?: { headline?: string | undefined }): FontRegistry {
  const reg = createDefaultFontRegistry();
  const h = fontChoice(opts?.headline);
  if (h && h.id !== "default") {
    reg.register("display", { family: h.family, weights: HEADLINE_WEIGHTS });
  }
  return reg;
}
