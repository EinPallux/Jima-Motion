import type { Container } from "pixi.js";
import type { Aspect } from "../layout/aspect";
import { sizeOf, type Size } from "../layout/aspect";
import { createRng } from "../timeline/rng";
import type { JimaTimeline } from "../timeline/timeline";
import type { FontRegistry} from "../text/fonts";
import { createDefaultFontRegistry } from "../text/fonts";
import {
  resolveValues,
  type Palette,
  type TemplateDefinition,
  type Values,
} from "../sdk/types";
import { SceneRenderer, createRoot } from "./stage";

export interface RunnerConfig {
  aspect: Aspect;
  values?: Values;
  paletteId?: string;
  seed?: number;
  resolution?: number;
  fonts?: FontRegistry;
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
 */
export class TemplateRunner {
  readonly def: TemplateDefinition;
  readonly aspect: Aspect;
  readonly size: Size;
  readonly root: Container;
  readonly timeline: JimaTimeline;
  readonly duration: number;
  private readonly scene: SceneRenderer;

  private constructor(args: {
    def: TemplateDefinition;
    aspect: Aspect;
    size: Size;
    root: Container;
    timeline: JimaTimeline;
    duration: number;
    scene: SceneRenderer;
  }) {
    this.def = args.def;
    this.aspect = args.aspect;
    this.size = args.size;
    this.root = args.root;
    this.timeline = args.timeline;
    this.duration = args.duration;
    this.scene = args.scene;
  }

  static async create(def: TemplateDefinition, config: RunnerConfig): Promise<TemplateRunner> {
    const aspect = config.aspect;
    const size = sizeOf(aspect);
    const values = resolveValues(def, config.values);
    const palette = pickPalette(def, config.paletteId);
    const fonts = config.fonts ?? createDefaultFontRegistry();

    // Load only the faces this template's roles need, plus registry defaults.
    await fonts.ensureAll();

    const root = createRoot();
    const built = def.build({
      root,
      aspect,
      size,
      values,
      palette,
      rng: createRng(config.seed ?? 0x1a1a),
      fonts,
    });
    const duration = built.duration ?? built.timeline.duration;

    const scene = await SceneRenderer.create({
      size,
      resolution: config.resolution ?? 1,
      background: "#ffffff",
    });

    const runner = new TemplateRunner({
      def,
      aspect,
      size,
      root,
      timeline: built.timeline,
      duration,
      scene,
    });
    scene.onContextLost(() => runner.renderAt(runner.lastT));
    return runner;
  }

  private lastT = 0;

  get canvas(): HTMLCanvasElement {
    return this.scene.canvas;
  }

  /** Evaluate the timeline at t (seconds) and paint one frame. */
  renderAt(t: number): void {
    this.lastT = t;
    this.timeline.evaluate(t);
    this.scene.render(this.root);
  }

  destroy(): void {
    this.scene.destroy();
    this.root.destroy({ children: true });
  }
}
