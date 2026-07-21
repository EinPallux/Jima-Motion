import { Texture, type Container } from "pixi.js";
import type { Aspect } from "../layout/aspect";
import { sizeOf, type Size } from "../layout/aspect";
import { createRng } from "../timeline/rng";
import type { JimaTimeline } from "../timeline/timeline";
import type { FontRegistry } from "../text/fonts";
import { createDefaultFontRegistry } from "../text/fonts";
import { isImageRef, resolveValues, type Palette, type TemplateDefinition, type Values } from "../sdk/types";
import { SceneRenderer, createRoot } from "./stage";

type ImageMap = Record<string, Texture | null>;

async function loadImages(def: TemplateDefinition, values: Values): Promise<ImageMap> {
  const map: ImageMap = {};
  const jobs = def.fields
    .filter((f) => f.type === "image")
    .map(async (f) => {
      const v = values[f.key];
      if (isImageRef(v)) {
        try {
          const res = await fetch(v.url);
          const bmp = await createImageBitmap(await res.blob());
          map[f.key] = Texture.from(bmp);
        } catch {
          map[f.key] = null;
        }
      } else {
        map[f.key] = null;
      }
    });
  await Promise.all(jobs);
  return map;
}

export interface RunnerConfig {
  aspect: Aspect;
  values?: Values;
  paletteId?: string;
  seed?: number;
  resolution?: number;
  fonts?: FontRegistry;
  /** Clear the canvas with alpha 0 (for transparent/alpha WebM export). */
  transparent?: boolean;
}

function pickPalette(def: TemplateDefinition, id?: string): Palette {
  if (id) {
    const found = def.palettes.find((p) => p.id === id);
    if (found) return found;
  }
  const first = def.palettes[0];
  if (!first) throw new Error(`Template "${def.id}" declares no palettes`);
  return first;
}

/**
 * A built, seekable template instance bound to a renderer. `renderAt(t)` is a
 * pure function of t (the timeline is stateless), so preview, golden frames and
 * export all drive it the same way and get identical pixels.
 *
 * `rebuildScene` rebuilds the scene graph in place (same renderer/canvas/aspect)
 * for live editing — cheap enough for per-keystroke value changes.
 */
export class TemplateRunner {
  readonly def: TemplateDefinition;
  readonly aspect: Aspect;
  readonly size: Size;
  root: Container;
  timeline: JimaTimeline;
  duration: number;
  private update: ((t: number) => void) | undefined;
  private images: ImageMap;
  private readonly scene: SceneRenderer;
  private readonly fonts: FontRegistry;
  private readonly seed: number;
  private lastT = 0;

  private constructor(args: {
    def: TemplateDefinition;
    aspect: Aspect;
    size: Size;
    root: Container;
    timeline: JimaTimeline;
    duration: number;
    update: ((t: number) => void) | undefined;
    images: ImageMap;
    scene: SceneRenderer;
    fonts: FontRegistry;
    seed: number;
  }) {
    this.def = args.def;
    this.aspect = args.aspect;
    this.size = args.size;
    this.root = args.root;
    this.timeline = args.timeline;
    this.duration = args.duration;
    this.update = args.update;
    this.images = args.images;
    this.scene = args.scene;
    this.fonts = args.fonts;
    this.seed = args.seed;
  }

  static async create(def: TemplateDefinition, config: RunnerConfig): Promise<TemplateRunner> {
    const aspect = config.aspect;
    const size = sizeOf(aspect);
    const fonts = config.fonts ?? createDefaultFontRegistry();
    await fonts.ensureAll();

    const seed = config.seed ?? 0x1a1a;
    const images = await loadImages(def, resolveValues(def, config.values));
    const built = buildScene(def, {
      size,
      aspect,
      values: config.values,
      paletteId: config.paletteId,
      fonts,
      seed,
      images,
    });

    const scene = await SceneRenderer.create({
      size,
      resolution: config.resolution ?? 1,
      background: "#ffffff",
      ...(config.transparent ? { backgroundAlpha: 0 } : {}),
    });

    const runner = new TemplateRunner({
      def,
      aspect,
      size,
      root: built.root,
      timeline: built.timeline,
      duration: built.duration,
      update: built.update,
      images,
      scene,
      fonts,
      seed,
    });
    scene.onContextLost(() => runner.renderAt(runner.lastT));
    return runner;
  }

  get canvas(): HTMLCanvasElement {
    return this.scene.canvas;
  }

  /**
   * Rebuild the scene graph with new values/palette (same renderer + aspect).
   * Reuses already-loaded image textures — add/remove of an image should go
   * through a full recreate (the Studio keys the preview on image changes).
   */
  rebuildScene(values?: Values, paletteId?: string): void {
    this.root.destroy({ children: true });
    const built = buildScene(this.def, {
      size: this.size,
      aspect: this.aspect,
      values,
      paletteId,
      fonts: this.fonts,
      seed: this.seed,
      images: this.images,
    });
    this.root = built.root;
    this.timeline = built.timeline;
    this.duration = built.duration;
    this.update = built.update;
    this.renderAt(Math.min(this.lastT, this.duration));
  }

  /** Change render resolution in place (e.g. on preview container resize). */
  resize(resolution: number): void {
    this.scene.resize(this.size, resolution);
    this.renderAt(this.lastT);
  }

  /** Evaluate the timeline at t (seconds) and paint one frame. */
  renderAt(t: number): void {
    this.lastT = t;
    this.timeline.evaluate(t);
    this.update?.(t);
    this.scene.render(this.root);
  }

  destroy(): void {
    this.scene.destroy();
    this.root.destroy({ children: true });
  }
}

function buildScene(
  def: TemplateDefinition,
  args: {
    size: Size;
    aspect: Aspect;
    values?: Values | undefined;
    paletteId?: string | undefined;
    fonts: FontRegistry;
    seed: number;
    images: ImageMap;
  },
): { root: Container; timeline: JimaTimeline; duration: number; update: ((t: number) => void) | undefined } {
  const values = resolveValues(def, args.values);
  const palette = pickPalette(def, args.paletteId);
  const root = createRoot();
  const built = def.build({
    root,
    aspect: args.aspect,
    size: args.size,
    values,
    palette,
    rng: createRng(args.seed),
    fonts: args.fonts,
    images: args.images,
  });
  return {
    root,
    timeline: built.timeline,
    duration: built.duration ?? built.timeline.duration,
    update: built.update,
  };
}
