import type { Container, Texture } from "pixi.js";
import type { Aspect, Size } from "../layout/aspect";
import type { Rng } from "../timeline/rng";
import type { JimaTimeline } from "../timeline/timeline";
import type { FontRegistry, FontRole } from "../text/fonts";

export type { Aspect } from "../layout/aspect";

export type TemplateCategory =
  | "announcement"
  | "statement"
  | "promo"
  | "product"
  | "tech"
  | "photo"
  | "stat"
  | "testimonial"
  | "brand"
  | "event"
  | "educational"
  | "comparison"
  | "social"
  | "travel";

export type FieldType =
  | "text"
  | "textarea"
  | "textlist"
  | "image"
  | "color"
  | "select"
  | "slider"
  | "toggle";

export interface SelectOption {
  value: string;
  label: string;
}

// One editable control. Constraints are optional and type-specific; the Studio
// renders the right widget per `type` (DESIGN_ARCHITECTURE.md §7.2).
export interface TemplateField {
  key: string;
  type: FieldType;
  label: string;
  default: unknown;
  help?: string;
  optional?: boolean;
  // text / textarea / textlist
  maxLength?: number;
  maxLines?: number;
  minItems?: number;
  maxItems?: number;
  shrinkToFit?: boolean;
  // select
  options?: SelectOption[];
  // slider
  min?: number;
  max?: number;
  step?: number;
}

export interface Palette {
  id: string;
  name: string;
  /** Named color roles this palette provides; templates read by key. */
  colors: Record<string, string>;
}

export type Values = Record<string, unknown>;

// Everything a template's build() needs. Provided by the runtime per
// (template, aspect, values). Pure inputs only — no globals, no wall-clock.
export interface TemplateContext {
  root: Container;
  aspect: Aspect;
  size: Size;
  values: Values;
  palette: Palette;
  rng: Rng;
  fonts: FontRegistry;
  /** Pre-loaded textures for image fields (null when empty/unset). */
  images: Record<string, Texture | null>;
}

export interface BuiltTemplate {
  timeline: JimaTimeline;
  /** Seconds at speed 1. Defaults to timeline.duration; override to add a hold. */
  duration?: number;
  /**
   * Optional per-frame hook run after `timeline.evaluate(t)`, before render.
   * Must be a pure function of t (count-ups, particle physics, digit rolls).
   */
  update?: (t: number) => void;
}

/** A value that references a user image by object URL (from the Studio). */
export function isImageRef(v: unknown): v is { url: string } {
  return typeof v === "object" && v !== null && typeof (v as { url?: unknown }).url === "string";
}

export interface TemplateDefinition {
  id: string;
  name: string;
  tagline: string;
  category: TemplateCategory;
  aspects: Aspect[];
  defaultAspect: Aspect;
  loopable: boolean;
  /** Seconds — gallery/OG poster frame. */
  posterTime: number;
  fields: TemplateField[];
  palettes: Palette[];
  fontRoles?: Record<string, FontRole>;
  /** Estimate duration before a full build (for UI); optional. */
  estimateDuration?: (values: Values) => number;
  build: (ctx: TemplateContext) => BuiltTemplate;
}

/** Merge a template's field defaults with partial user values. */
export function resolveValues(def: TemplateDefinition, values?: Values): Values {
  const out: Values = {};
  for (const f of def.fields) out[f.key] = f.default;
  if (values) {
    for (const key of Object.keys(values)) {
      if (values[key] !== undefined) out[key] = values[key];
    }
  }
  return out;
}
