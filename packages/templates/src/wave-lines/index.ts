import { Container, Graphics } from "pixi.js";
import {
  JimaTimeline,
  type BuiltTemplate,
  type Palette,
  type TemplateContext,
  type TemplateDefinition,
} from "@jima/engine";

const str = (v: unknown, fallback: string): string =>
  typeof v === "string" && v.length > 0 ? v : fallback;
const num = (v: unknown, d: number): number => (typeof v === "number" ? v : d);
const on = (v: unknown): boolean => v !== false;

// A calm, endless backdrop of horizontal sine bands. Everything lives in a
// per-frame update(t) driven by periodic functions — no timeline tweens — so
// u=t/DUR reaches exactly 1 at t=DUR and every sine lands back on its u=0
// phase (a whole number of cycles), keeping the loop seam seamless.
const PALETTES: Palette[] = [
  { id: "ink-white", name: "Ink on white", colors: { background: "#FFFFFF", lineColor: "#101014" } },
  { id: "night-lime", name: "Night lime", colors: { background: "#101014", lineColor: "#D8F34D" } },
  { id: "cream-ember", name: "Cream ember", colors: { background: "#FAF5EA", lineColor: "#FF4D1C" } },
  { id: "violet-mist", name: "Violet mist", colors: { background: "#F3EEFF", lineColor: "#7C5CFF" } },
];

const DUR = 6.0;
const SEGMENTS = 28;

interface WaveLine {
  g: Graphics;
  baseline: number;
  amp: number;
  phase: number;
  spatialFreq: number;
  /** Signed integer cycles over DUR — keeps the traveling wave loop-safe. */
  travel: number;
  /** 0..1, 1 = nearest the vertical center. */
  depth: number;
}

function build(ctx: TemplateContext): BuiltTemplate {
  const { root, size, values, palette, rng } = ctx;
  const pc = (k: string, d: string): string => palette.colors[k] ?? d;
  const bg = str(values.background, pc("background", "#FFFFFF"));
  const lineColor = str(values.lineColor, pc("lineColor", "#101014"));
  const showGradient = on(values.showGradient);
  const lineCount = Math.max(4, Math.min(12, Math.round(num(values.lineCount, 8))));

  const w = size.width;
  const h = size.height;
  const minDim = Math.min(w, h);

  const bgRect = new Graphics().rect(0, 0, w, h).fill(bg);
  bgRect.label = "bg";
  root.addChild(bgRect);

  const layer = new Container();
  layer.label = "lines";
  root.addChild(layer);

  const topF = 0.12;
  const botF = 0.88;
  const spanH = h * (botF - topF);
  const centerIdx = (lineCount - 1) / 2; // lineCount >= 4, so this is always > 0

  const lines: WaveLine[] = [];
  for (let i = 0; i < lineCount; i++) {
    const baseline = h * topF + (i / (lineCount - 1)) * spanH;
    const depth = 1 - Math.abs(i - centerIdx) / centerIdx;
    const g = new Graphics();
    layer.addChild(g);
    lines.push({
      g,
      baseline,
      amp: minDim * rng.range(0.018, 0.03),
      phase: rng.range(0, Math.PI * 2),
      spatialFreq: rng.range(1.1, 2.1),
      travel: rng.pick([-2, -1, 1, 2]),
      depth,
    });
  }

  const padX = w * 0.03;
  const x0 = -padX;
  const x1 = w + padX;
  const baseWidth = Math.max(3, minDim * 0.012);

  const update = (t: number): void => {
    const u = t / DUR;
    const travelBase = u * Math.PI * 2;
    for (const ln of lines) {
      const alpha = showGradient ? 0.32 + 0.68 * ln.depth : 0.92;
      const strokeW = showGradient ? baseWidth * (0.55 + 0.45 * ln.depth) : baseWidth;
      const travelPhase = ln.phase + travelBase * ln.travel;
      ln.g.clear();
      ln.g.moveTo(x0, ln.baseline + Math.sin(travelPhase) * ln.amp);
      for (let s = 1; s <= SEGMENTS; s++) {
        const xf = s / SEGMENTS;
        const x = x0 + (x1 - x0) * xf;
        const y = ln.baseline + Math.sin(xf * Math.PI * 2 * ln.spatialFreq + travelPhase) * ln.amp;
        ln.g.lineTo(x, y);
      }
      ln.g.stroke({ color: lineColor, width: strokeW, cap: "round", join: "round", alpha });
    }
  };

  return { timeline: new JimaTimeline(), duration: DUR, update };
}

export const waveLines: TemplateDefinition = {
  id: "wave-lines",
  name: "Wave Lines",
  tagline: "Undulating sine-wave bands loop seamlessly behind your content.",
  category: "loop",
  aspects: ["1:1", "4:5", "9:16", "16:9"],
  defaultAspect: "1:1",
  loopable: true,
  posterTime: 3.0,
  palettes: PALETTES,
  fields: [
    { key: "lineCount", type: "slider", label: "Lines", default: 8, min: 4, max: 12, step: 1 },
    { key: "showGradient", type: "toggle", label: "Fade by depth", default: true },
    { key: "background", type: "color", label: "Background", default: "", optional: true },
    { key: "lineColor", type: "color", label: "Line color", default: "", optional: true },
  ],
  build,
};
