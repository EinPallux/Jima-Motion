import { autoDetectRenderer, Container, type Renderer } from "pixi.js";
import type { Size } from "../layout/aspect";

export interface SceneRendererOptions {
  size: Size;
  /** Device/exports scale. Preview clamps to ≤2; export sets exact output scale. */
  resolution?: number;
  background?: string | number;
  backgroundAlpha?: number;
  antialias?: boolean;
}

/**
 * Owns a Pixi WebGL renderer and renders a scene deterministically.
 *
 * WebGL is forced (not WebGPU): its readback is synchronous and consistent
 * across devices, which matters for golden frames and export (ADR-004). Render
 * happens on demand — there is no Ticker — so a given (scene, t) always paints
 * identical pixels.
 */
export class SceneRenderer {
  readonly renderer: Renderer;
  private lostHandler: (() => void) | null = null;

  private constructor(renderer: Renderer) {
    this.renderer = renderer;
  }

  static async create(opts: SceneRendererOptions): Promise<SceneRenderer> {
    const resolution = opts.resolution ?? 1;
    const renderer = await autoDetectRenderer({
      preference: "webgl",
      width: opts.size.width,
      height: opts.size.height,
      resolution,
      autoDensity: false,
      background: opts.background ?? "#ffffff",
      backgroundAlpha: opts.backgroundAlpha ?? 1,
      antialias: opts.antialias ?? true,
      clearBeforeRender: true,
      // Keep the drawn buffer readable so the exporter can capture each frame
      // (VideoFrame-from-canvas / 2D readback) reliably after render.
      preserveDrawingBuffer: true,
    });
    return new SceneRenderer(renderer);
  }

  get canvas(): HTMLCanvasElement {
    return this.renderer.canvas as HTMLCanvasElement;
  }

  resize(size: Size, resolution?: number): void {
    if (resolution !== undefined) this.renderer.resolution = resolution;
    this.renderer.resize(size.width, size.height);
  }

  render(root: Container): void {
    this.renderer.render(root);
  }

  /**
   * Wire context-loss recovery. The GL context holds no state we can't rebuild
   * from the store, so on restore the caller just re-renders the current frame.
   */
  onContextLost(reRender: () => void): void {
    const canvas = this.canvas;
    this.lostHandler = () => {
      // Give the driver a tick, then repaint from application state.
      queueMicrotask(reRender);
    };
    canvas.addEventListener("webglcontextrestored", this.lostHandler);
  }

  destroy(): void {
    if (this.lostHandler) {
      this.canvas.removeEventListener("webglcontextrestored", this.lostHandler);
      this.lostHandler = null;
    }
    this.renderer.destroy();
  }
}

/** A fresh empty root container for a scene. */
export function createRoot(): Container {
  const root = new Container();
  root.label = "jima-root";
  return root;
}
