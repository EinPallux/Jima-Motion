import { Container, Graphics } from "pixi.js";
import {
  JimaTimeline,
  linear,
  type BuiltTemplate,
  type Palette,
  type TemplateContext,
  type TemplateDefinition,
} from "@jima/engine";

const str = (v: unknown, fallback: string): string =>
  typeof v === "string" && v.length > 0 ? v : fallback;
const num = (v: unknown, d: number): number => (typeof v === "number" ? v : d);

const TAU = Math.PI * 2;

const PALETTES: Palette[] = [
  { id: "paper-ink", name: "Paper ink", colors: { background: "#FAF7F2", accent1: "#101014", accent2: "#FF4D1C" } },
  { id: "night-confetti", name: "Night confetti", colors: { background: "#0F1220", accent1: "#7C5CFF", accent2: "#38C7FF" } },
  { id: "citrus-pop", name: "Citrus pop", colors: { background: "#FFFDF5", accent1: "#FF6A1A", accent2: "#17A34A" } },
  { id: "berry-cream", name: "Berry cream", colors: { background: "#FFF1F6", accent1: "#FF2E9E", accent2: "#3455E6" } },
];

type ShapeMode = "mixed" | "circles" | "squares";
type ShapeKind = "circle" | "square" | "triangle";

/** A point-up triangle centered at the origin. */
function triangleGraphic(rad: number, color: string): Graphics {
  const pts: number[] = [];
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + (i * TAU) / 3;
    pts.push(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  return new Graphics().poly(pts).fill(color);
}

function shapeGraphic(kind: ShapeKind, rad: number, color: string): Graphics {
  switch (kind) {
    case "circle":
      return new Graphics().circle(0, 0, rad).fill(color);
    case "square":
      return new Graphics().roundRect(-rad, -rad, rad * 2, rad * 2, rad * 0.22).fill(color);
    case "triangle":
      return triangleGraphic(rad * 1.15, color);
  }
}

interface Shape {
  node: Graphics;
  x0: number;
  y0: number;
  driftR: number;
  posPhase: number;
  posCycles: number;
  rotBase: number;
  rotDir: number;
  rotTurns: number;
  baseAlpha: number;
}

function build(ctx: TemplateContext): BuiltTemplate {
  const { root, size, values, palette, rng } = ctx;
  const pcol = (key: string, d: string): string => palette.colors[key] ?? d;
  const bg = str(values.background, pcol("background", "#FAF7F2"));
  const accent1 = str(values.accent1, pcol("accent1", "#101014"));
  const accent2 = str(values.accent2, pcol("accent2", "#FF4D1C"));
  const mode = str(values.shape, "mixed") as ShapeMode;
  const density = Math.max(8, Math.min(24, Math.round(num(values.density, 14))));

  const w = size.width;
  const h = size.height;
  const minDim = Math.min(w, h);

  const bgRect = new Graphics().rect(0, 0, w, h).fill(bg);
  bgRect.label = "bg";
  root.addChild(bgRect);

  const DUR = 6.0;
  const omega = TAU / DUR;
  const timeline = new JimaTimeline();
  // Loops carry all their motion in update(); this keeps the timeline valid
  // without touching pixels.
  timeline.to(bgRect, { prop: "alpha", from: 1, to: 1, start: 0, duration: DUR, ease: linear });

  const layer = new Container();
  layer.label = "shapes";
  root.addChild(layer);

  const kinds: ShapeKind[] = ["circle", "square", "triangle"];
  const shapes: Shape[] = [];
  for (let i = 0; i < density; i++) {
    const kind: ShapeKind = mode === "circles" ? "circle" : mode === "squares" ? "square" : rng.pick(kinds);
    const rad = minDim * rng.range(0.018, 0.045);
    const color = i % 2 === 0 ? accent1 : accent2;
    const node = shapeGraphic(kind, rad, color);
    const x0 = w * rng.range(0.08, 0.92);
    const y0 = h * rng.range(0.1, 0.9);
    node.position.set(x0, y0);
    layer.addChild(node);
    shapes.push({
      node,
      x0,
      y0,
      driftR: minDim * rng.range(0.02, 0.055),
      posPhase: rng.range(0, TAU),
      posCycles: rng.int(1, 2),
      rotBase: rng.range(0, TAU),
      rotDir: rng.pick([-1, 1]),
      rotTurns: rng.int(1, 2),
      baseAlpha: rng.range(0.55, 0.9),
    });
  }

  // Every angle is `phase + integerCount * omega * t` (position) or a full
  // integer number of turns (rotation), so t = DUR lands back on the t = 0
  // value exactly — the loop seam is invisible.
  const update = (t: number): void => {
    for (const s of shapes) {
      const ang = s.posPhase + s.posCycles * omega * t;
      s.node.x = s.x0 + Math.cos(ang) * s.driftR;
      s.node.y = s.y0 + Math.sin(ang) * s.driftR * 0.72;
      s.node.rotation = s.rotBase + s.rotDir * s.rotTurns * omega * t;
      s.node.alpha = s.baseAlpha + 0.1 * Math.sin(ang);
    }
  };

  return { timeline, duration: DUR, update };
}

export const floatingShapes: TemplateDefinition = {
  id: "floating-shapes",
  name: "Floating Shapes",
  tagline: "Small geometric shapes drift and spin in a seamless loop.",
  category: "loop",
  aspects: ["1:1", "4:5", "9:16", "16:9"],
  defaultAspect: "1:1",
  loopable: true,
  posterTime: 3.0,
  palettes: PALETTES,
  fields: [
    { key: "density", type: "slider", label: "Shape count", default: 14, min: 8, max: 24, step: 1 },
    {
      key: "shape",
      type: "select",
      label: "Shapes",
      default: "mixed",
      options: [
        { value: "mixed", label: "Mixed" },
        { value: "circles", label: "Circles" },
        { value: "squares", label: "Squares" },
      ],
    },
    { key: "background", type: "color", label: "Background", default: "", optional: true },
    { key: "accent1", type: "color", label: "Color 1", default: "", optional: true },
    { key: "accent2", type: "color", label: "Color 2", default: "", optional: true },
  ],
  build,
};
