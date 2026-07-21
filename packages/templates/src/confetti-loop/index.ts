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

// Confetti drifts down and wraps from bottom back to top, forever. Every piece
// is seeded once at build (shape, color, size, phase) and then driven purely
// by update(t): fall uses `(phase + u*range) % range`, which is identical at
// u=0 and u=1 (u=1 adds exactly one whole `range`), and the wrap point sits
// fully off-screen (± margin), so the loop seam is invisible.
const PALETTES: Palette[] = [
  { id: "party-white", name: "Party on white", colors: { background: "#FFFFFF", confetti1: "#FF4D1C", confetti2: "#2E7DF6", confetti3: "#D8F34D" } },
  { id: "night-glow", name: "Night glow", colors: { background: "#101014", confetti1: "#FF2E9E", confetti2: "#7C5CFF", confetti3: "#38C7FF" } },
  { id: "cream-citrus", name: "Cream citrus", colors: { background: "#FAF5EA", confetti1: "#FF4D1C", confetti2: "#FFD23F", confetti3: "#17A34A" } },
  { id: "berry-pop", name: "Berry pop", colors: { background: "#FCEFF7", confetti1: "#FF2E9E", confetti2: "#7C5CFF", confetti3: "#FF4D1C" } },
];

const DUR = 6.0;

interface Piece {
  g: Graphics;
  baseX: number;
  basePhase: number;
  range: number;
  margin: number;
  swayAmp: number;
  swayCycles: number;
  swayPhase: number;
  rotBase: number;
  rotAmp: number;
  rotCycles: number;
  rotPhase: number;
}

function build(ctx: TemplateContext): BuiltTemplate {
  const { root, size, values, palette, rng } = ctx;
  const pc = (k: string, d: string): string => palette.colors[k] ?? d;
  const bg = str(values.background, pc("background", "#FFFFFF"));
  const colors = [
    str(values.confetti1, pc("confetti1", "#FF4D1C")),
    str(values.confetti2, pc("confetti2", "#2E7DF6")),
    str(values.confetti3, pc("confetti3", "#D8F34D")),
  ];
  const count = Math.max(12, Math.min(40, Math.round(num(values.count, 24))));

  const w = size.width;
  const h = size.height;
  const minDim = Math.min(w, h);

  const bgRect = new Graphics().rect(0, 0, w, h).fill(bg);
  bgRect.label = "bg";
  root.addChild(bgRect);

  const layer = new Container();
  layer.label = "confetti";
  root.addChild(layer);

  const pieces: Piece[] = [];
  for (let i = 0; i < count; i++) {
    const pSize = minDim * rng.range(0.02, 0.036);
    const color = rng.pick(colors);
    const g = new Graphics();
    if (rng.next() < 0.5) {
      g.rect(-pSize / 2, -pSize * 0.32, pSize, pSize * 0.64).fill(color);
    } else {
      g.poly([0, -pSize * 0.55, pSize * 0.5, pSize * 0.42, -pSize * 0.5, pSize * 0.42]).fill(color);
    }
    g.alpha = rng.range(0.82, 1);
    layer.addChild(g);

    // Margin keeps a piece fully hidden beyond the frame edge while it wraps.
    const margin = minDim * 0.07 + pSize;
    const range = h + margin * 2;
    pieces.push({
      g,
      baseX: rng.range(0, w),
      basePhase: rng.range(0, range),
      range,
      margin,
      swayAmp: minDim * rng.range(0.012, 0.03),
      swayCycles: rng.int(1, 3),
      swayPhase: rng.range(0, Math.PI * 2),
      rotBase: rng.range(0, Math.PI * 2),
      rotAmp: rng.range(0.35, 0.9),
      rotCycles: rng.int(1, 4),
      rotPhase: rng.range(0, Math.PI * 2),
    });
  }

  const update = (t: number): void => {
    const u = t / DUR;
    const wave = u * Math.PI * 2;
    for (const p of pieces) {
      const yRaw = (p.basePhase + u * p.range) % p.range;
      p.g.y = yRaw - p.margin;
      p.g.x = p.baseX + Math.sin(wave * p.swayCycles + p.swayPhase) * p.swayAmp;
      p.g.rotation = p.rotBase + Math.sin(wave * p.rotCycles + p.rotPhase) * p.rotAmp;
    }
  };

  return { timeline: new JimaTimeline(), duration: DUR, update };
}

export const confettiLoop: TemplateDefinition = {
  id: "confetti-loop",
  name: "Confetti Loop",
  tagline: "Gentle falling confetti wraps into an endless loop.",
  category: "loop",
  aspects: ["1:1", "4:5", "9:16", "16:9"],
  defaultAspect: "9:16",
  loopable: true,
  posterTime: 3.0,
  palettes: PALETTES,
  fields: [
    { key: "count", type: "slider", label: "Confetti count", default: 24, min: 12, max: 40, step: 2 },
    { key: "background", type: "color", label: "Background", default: "", optional: true },
    { key: "confetti1", type: "color", label: "Confetti 1", default: "", optional: true },
    { key: "confetti2", type: "color", label: "Confetti 2", default: "", optional: true },
    { key: "confetti3", type: "color", label: "Confetti 3", default: "", optional: true },
  ],
  build,
};
