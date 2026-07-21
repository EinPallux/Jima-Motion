import { Container, Graphics, Sprite } from "pixi.js";
import {
  JimaTimeline,
  linear,
  type BuiltTemplate,
  type Palette,
  type TemplateContext,
  type TemplateDefinition,
} from "@jima/engine";
import { radialGlowTexture } from "../shared/glow";

const str = (v: unknown, fallback: string): string =>
  typeof v === "string" && v.length > 0 ? v : fallback;
const num = (v: unknown, d: number): number => (typeof v === "number" ? v : d);

const TAU = Math.PI * 2;

const PALETTES: Palette[] = [
  { id: "dusk-gold", name: "Dusk gold", colors: { background: "#140D22", dotColor: "#FFD37A" } },
  { id: "midnight-rose", name: "Midnight rose", colors: { background: "#1A0B14", dotColor: "#FF6FA8" } },
  { id: "ocean-glow", name: "Ocean glow", colors: { background: "#081826", dotColor: "#5FD4FF" } },
  { id: "cream-blush", name: "Cream blush", colors: { background: "#FFF6F2", dotColor: "#FF8FAE" } },
];

interface Dot {
  sprite: Sprite;
  x0: number;
  y0: number;
  ampX: number;
  ampY: number;
  phaseX: number;
  phaseY: number;
  phaseA: number;
  cyclesX: number;
  cyclesY: number;
  cyclesA: number;
  baseAlpha: number;
}

function build(ctx: TemplateContext): BuiltTemplate {
  const { root, size, values, palette, rng } = ctx;
  const pcol = (key: string, d: string): string => palette.colors[key] ?? d;
  const bg = str(values.background, pcol("background", "#140D22"));
  const dotColor = str(values.dotColor, pcol("dotColor", "#FFD37A"));
  const count = Math.max(10, Math.min(30, Math.round(num(values.count, 18))));

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
  layer.label = "bokeh";
  root.addChild(layer);

  const glowTex = radialGlowTexture();
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    const dia = minDim * rng.range(0.035, 0.16);
    const sprite = new Sprite(glowTex);
    sprite.anchor.set(0.5);
    sprite.tint = dotColor;
    sprite.width = dia;
    sprite.height = dia;
    const x0 = w * rng.range(0.06, 0.94);
    const y0 = h * rng.range(0.08, 0.92);
    sprite.position.set(x0, y0);
    layer.addChild(sprite);
    dots.push({
      sprite,
      x0,
      y0,
      ampX: minDim * rng.range(0.01, 0.035),
      ampY: minDim * rng.range(0.07, 0.16),
      phaseX: rng.range(0, TAU),
      phaseY: rng.range(0, TAU),
      phaseA: rng.range(0, TAU),
      cyclesX: rng.int(1, 2),
      cyclesY: rng.int(1, 2),
      cyclesA: rng.int(1, 2),
      baseAlpha: rng.range(0.3, 0.62),
    });
  }

  // Every angle is `phase + integerCycles * omega * t`, so t = DUR lands back
  // on the t = 0 value exactly (sin is 2*pi-periodic) — the loop is seamless.
  const update = (t: number): void => {
    for (const d of dots) {
      const angX = d.phaseX + d.cyclesX * omega * t;
      const angY = d.phaseY + d.cyclesY * omega * t;
      const angA = d.phaseA + d.cyclesA * omega * t;
      d.sprite.x = d.x0 + Math.sin(angX) * d.ampX;
      d.sprite.y = d.y0 + Math.sin(angY) * d.ampY;
      d.sprite.alpha = d.baseAlpha * (0.5 + 0.5 * Math.sin(angA));
    }
  };

  return { timeline, duration: DUR, update };
}

export const bokehDrift: TemplateDefinition = {
  id: "bokeh-drift",
  name: "Bokeh Drift",
  tagline: "Soft out-of-focus light circles float and fade on a seamless loop.",
  category: "loop",
  aspects: ["1:1", "4:5", "9:16", "16:9"],
  defaultAspect: "16:9",
  loopable: true,
  posterTime: 3.0,
  palettes: PALETTES,
  fields: [
    { key: "count", type: "slider", label: "Dot count", default: 18, min: 10, max: 30, step: 2 },
    { key: "background", type: "color", label: "Background", default: "", optional: true },
    { key: "dotColor", type: "color", label: "Dot color", default: "", optional: true },
  ],
  build,
};
