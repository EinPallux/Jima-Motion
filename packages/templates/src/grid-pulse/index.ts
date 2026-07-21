import { Container, Graphics } from "pixi.js";
import {
  JimaTimeline,
  type Aspect,
  type BuiltTemplate,
  type Palette,
  type TemplateContext,
  type TemplateDefinition,
} from "@jima/engine";

const str = (v: unknown, fallback: string): string =>
  typeof v === "string" && v.length > 0 ? v : fallback;
const on = (v: unknown): boolean => v !== false;

// A grid of dots rippling outward from center, forever. Positions are fixed at
// build time; only scale/alpha (and the ring's radius) change per frame, driven
// entirely by update(t) — no timeline tweens — so u=0 and u=1 land on the same
// trig phase and the loop seam is seamless.
const PALETTES: Palette[] = [
  { id: "ink-white", name: "Ink on white", colors: { background: "#FFFFFF", dotColor: "#101014" } },
  { id: "night-lime", name: "Night lime", colors: { background: "#101014", dotColor: "#D8F34D" } },
  { id: "cream-ember", name: "Cream ember", colors: { background: "#FAF5EA", dotColor: "#FF4D1C" } },
  { id: "violet-mist", name: "Violet mist", colors: { background: "#F3EEFF", dotColor: "#7C5CFF" } },
];

interface GridCfg {
  cols: number;
  rows: number;
  topF: number;
  botF: number;
  wF: number;
}

const GRID: Record<Aspect, GridCfg> = {
  "1:1": { cols: 8, rows: 8, topF: 0.12, botF: 0.88, wF: 0.86 },
  "4:5": { cols: 7, rows: 9, topF: 0.11, botF: 0.89, wF: 0.84 },
  "9:16": { cols: 6, rows: 11, topF: 0.1, botF: 0.9, wF: 0.82 },
  "16:9": { cols: 12, rows: 7, topF: 0.12, botF: 0.88, wF: 0.88 },
};

const DUR = 5.0;
/** Ripple tightness across the normalized (0..~1) grid radius. */
const RIPPLE_K = 9.5;

interface Dot {
  g: Graphics;
  dist: number;
}

function build(ctx: TemplateContext): BuiltTemplate {
  const { root, size, values, palette } = ctx;
  const pc = (k: string, d: string): string => palette.colors[k] ?? d;
  const bg = str(values.background, pc("background", "#FFFFFF"));
  const dotColor = str(values.dotColor, pc("dotColor", "#101014"));
  const showRing = on(values.showRing);

  const w = size.width;
  const h = size.height;

  const bgRect = new Graphics().rect(0, 0, w, h).fill(bg);
  bgRect.label = "bg";
  root.addChild(bgRect);

  const cfg = GRID[ctx.aspect];
  const { cols, rows } = cfg;
  const availW = w * cfg.wF;
  const bandH = h * (cfg.botF - cfg.topF);
  const cellPitch = Math.min(availW / cols, bandH / rows);
  const gridW = cellPitch * cols;
  const gridH = cellPitch * rows;
  const gridCx = w / 2;
  const gridCy = h * ((cfg.topF + cfg.botF) / 2);
  const originX = gridCx - gridW / 2;
  const originY = gridCy - gridH / 2;
  const dotR = cellPitch * 0.16;
  const maxDist = Math.hypot(gridW / 2, gridH / 2);

  const layer = new Container();
  layer.label = "dots";
  root.addChild(layer);

  const dots: Dot[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = originX + (c + 0.5) * cellPitch;
      const cy = originY + (r + 0.5) * cellPitch;
      const g = new Graphics().circle(0, 0, dotR).fill(dotColor);
      g.position.set(cx, cy);
      layer.addChild(g);
      const dist = Math.hypot(cx - gridCx, cy - gridCy) / maxDist;
      dots.push({ g, dist });
    }
  }

  // Pulsing ring accent — guarded at creation (rule: decorative accents get a
  // toggle, and both the node and its per-frame update stay gated on it).
  const ring: Graphics | null = showRing ? new Graphics() : null;
  if (ring) {
    ring.position.set(gridCx, gridCy);
    ring.label = "ring";
    root.addChild(ring);
  }
  const ringMaxR = Math.max(gridW, gridH) * 0.62;
  const ringWidth = Math.max(2, Math.min(w, h) * 0.006);

  const update = (t: number): void => {
    const u = t / DUR;
    const wave = u * Math.PI * 2;
    for (const d of dots) {
      const s = Math.sin(wave - d.dist * RIPPLE_K);
      const p = (s + 1) / 2;
      d.g.scale.set(0.55 + 0.55 * p);
      d.g.alpha = 0.3 + 0.7 * p;
    }
    if (ring) {
      ring.clear();
      ring.circle(0, 0, u * ringMaxR).stroke({ color: dotColor, width: ringWidth, alpha: 1 - u });
    }
  };

  return { timeline: new JimaTimeline(), duration: DUR, update };
}

export const gridPulse: TemplateDefinition = {
  id: "grid-pulse",
  name: "Grid Pulse",
  tagline: "A grid of dots ripples outward in an endless loop.",
  category: "loop",
  aspects: ["1:1", "4:5", "9:16", "16:9"],
  defaultAspect: "1:1",
  loopable: true,
  posterTime: 2.5,
  palettes: PALETTES,
  fields: [
    { key: "showRing", type: "toggle", label: "Pulsing ring", default: true },
    { key: "background", type: "color", label: "Background", default: "", optional: true },
    { key: "dotColor", type: "color", label: "Dot color", default: "", optional: true },
  ],
  build,
};
