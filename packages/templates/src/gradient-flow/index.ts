import { Container, Graphics, Sprite, Texture, TilingSprite } from "pixi.js";
import {
  JimaTimeline,
  linear,
  type BuiltTemplate,
  type Palette,
  type Rng,
  type TemplateContext,
  type TemplateDefinition,
} from "@jima/engine";
import { radialGlowTexture } from "../shared/glow";

const str = (v: unknown, fallback: string): string =>
  typeof v === "string" && v.length > 0 ? v : fallback;
const on = (v: unknown): boolean => v !== false;

const TAU = Math.PI * 2;

const PALETTES: Palette[] = [
  { id: "sunset-mesh", name: "Sunset mesh", colors: { background: "#FFF8F2", colorA: "#FF6A3D", colorB: "#FF2E9E", colorC: "#7C5CFF" } },
  { id: "ocean-mesh", name: "Ocean mesh", colors: { background: "#06131F", colorA: "#38C7FF", colorB: "#2E7DF6", colorC: "#17E0B0" } },
  { id: "berry-mesh", name: "Berry mesh", colors: { background: "#180B1E", colorA: "#FF2E9E", colorB: "#7C5CFF", colorC: "#FF6A3D" } },
  { id: "citrus-mesh", name: "Citrus mesh", colors: { background: "#FFFCF2", colorA: "#D8F34D", colorB: "#FF8A3D", colorC: "#2E7DF6" } },
];

/** A baked radial vignette (transparent center -> dark edge), cached once. */
let vignetteCache: Texture | null = null;
function radialVignetteTexture(): Texture {
  if (vignetteCache) return vignetteCache;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const c = canvas.getContext("2d");
  if (!c) throw new Error("radialVignetteTexture: no 2D context");
  const g = c.createRadialGradient(size / 2, size / 2, size * 0.26, size / 2, size / 2, size * 0.5);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(0.7, "rgba(0,0,0,0.22)");
  g.addColorStop(1, "rgba(0,0,0,0.8)");
  c.fillStyle = g;
  c.fillRect(0, 0, size, size);
  vignetteCache = Texture.from(canvas);
  return vignetteCache;
}

/**
 * A small seeded noise tile for a static grain overlay. Uses `rng` only (never
 * Math.random) so it stays deterministic; generated once at build time, then
 * tiled across the frame with a TilingSprite.
 */
function makeGrainTexture(rng: Rng, tileSize: number): Texture {
  const canvas = document.createElement("canvas");
  canvas.width = tileSize;
  canvas.height = tileSize;
  const c = canvas.getContext("2d");
  if (!c) throw new Error("makeGrainTexture: no 2D context");
  const img = c.createImageData(tileSize, tileSize);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.round(rng.range(0, 255));
    const a = Math.round(rng.range(0, 70));
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = a;
  }
  c.putImageData(img, 0, 0);
  return Texture.from(canvas);
}

interface Blob {
  sprite: Sprite;
  x0: number;
  y0: number;
  radius: number;
  phase: number;
  cycles: number;
  baseScale: number;
  scalePhase: number;
  scaleCycles: number;
  scaleAmp: number;
  alphaPhase: number;
  alphaCycles: number;
  alphaAmp: number;
  baseAlpha: number;
}

function build(ctx: TemplateContext): BuiltTemplate {
  const { root, size, values, palette, rng } = ctx;
  const pcol = (key: string, d: string): string => palette.colors[key] ?? d;
  const bg = str(values.background, pcol("background", "#FFF8F2"));
  const colorA = str(values.colorA, pcol("colorA", "#FF6A3D"));
  const colorB = str(values.colorB, pcol("colorB", "#FF2E9E"));
  const colorC = str(values.colorC, pcol("colorC", "#7C5CFF"));
  const showGrain = on(values.showGrain);

  const w = size.width;
  const h = size.height;
  const minDim = Math.min(w, h);
  const maxDim = Math.max(w, h);

  const bgRect = new Graphics().rect(0, 0, w, h).fill(bg);
  bgRect.label = "bg";
  root.addChild(bgRect);

  const DUR = 6.0;
  const omega = TAU / DUR;
  const timeline = new JimaTimeline();
  // Loops carry all their motion in update(); this keeps the timeline valid
  // (and gives the sound layer a defined duration) without touching pixels.
  timeline.to(bgRect, { prop: "alpha", from: 1, to: 1, start: 0, duration: DUR, ease: linear });

  const blobLayer = new Container();
  blobLayer.label = "blobs";
  root.addChild(blobLayer);

  const colors = [colorA, colorB, colorC];
  const glowTex = radialGlowTexture();
  const blobs: Blob[] = [];
  const COUNT = 4;
  for (let i = 0; i < COUNT; i++) {
    const color = colors[i % colors.length]!;
    const dia = maxDim * rng.range(0.62, 1.0);
    const sprite = new Sprite(glowTex);
    sprite.anchor.set(0.5);
    sprite.tint = color;
    sprite.width = dia;
    sprite.height = dia;
    const baseScale = sprite.scale.x;
    const x0 = w * rng.range(0.22, 0.78);
    const y0 = h * rng.range(0.2, 0.8);
    sprite.position.set(x0, y0);
    blobLayer.addChild(sprite);
    blobs.push({
      sprite,
      x0,
      y0,
      radius: minDim * rng.range(0.06, 0.16),
      phase: rng.range(0, TAU),
      cycles: rng.int(1, 2),
      baseScale,
      scalePhase: rng.range(0, TAU),
      scaleCycles: rng.int(1, 2),
      scaleAmp: rng.range(0.06, 0.16),
      alphaPhase: rng.range(0, TAU),
      alphaCycles: rng.int(1, 2),
      alphaAmp: rng.range(0.08, 0.18),
      baseAlpha: rng.range(0.55, 0.8),
    });
  }

  if (showGrain) {
    const vignette = new Sprite(radialVignetteTexture());
    vignette.anchor.set(0.5);
    vignette.position.set(w / 2, h / 2);
    vignette.width = w * 1.15;
    vignette.height = h * 1.15;
    vignette.alpha = 0.55;
    root.addChild(vignette);

    const grainTex = makeGrainTexture(rng, 160);
    const grain = new TilingSprite({ texture: grainTex, width: w, height: h });
    grain.alpha = 0.5;
    root.addChild(grain);
  }

  // Every angle below is `phase + integerCycles * omega * t`, so at t = DUR
  // each one lands back on its t = 0 value exactly (sin/cos are 2*pi-periodic)
  // — the seam between the last and first frame is invisible.
  const update = (t: number): void => {
    for (const b of blobs) {
      const ang = b.phase + b.cycles * omega * t;
      b.sprite.x = b.x0 + Math.cos(ang) * b.radius;
      b.sprite.y = b.y0 + Math.sin(ang) * b.radius;
      const sAng = b.scalePhase + b.scaleCycles * omega * t;
      b.sprite.scale.set(b.baseScale * (1 + Math.sin(sAng) * b.scaleAmp));
      const aAng = b.alphaPhase + b.alphaCycles * omega * t;
      b.sprite.alpha = b.baseAlpha + Math.sin(aAng) * b.alphaAmp;
    }
  };

  return { timeline, duration: DUR, update };
}

export const gradientFlow: TemplateDefinition = {
  id: "gradient-flow",
  name: "Gradient Flow",
  tagline: "Soft color blobs drift into a living gradient, looped seamlessly.",
  category: "loop",
  aspects: ["1:1", "4:5", "9:16", "16:9"],
  defaultAspect: "16:9",
  loopable: true,
  posterTime: 3.0,
  palettes: PALETTES,
  fields: [
    { key: "showGrain", type: "toggle", label: "Grain overlay", default: true },
    { key: "background", type: "color", label: "Background", default: "", optional: true },
    { key: "colorA", type: "color", label: "Color A", default: "", optional: true },
    { key: "colorB", type: "color", label: "Color B", default: "", optional: true },
    { key: "colorC", type: "color", label: "Color C", default: "", optional: true },
  ],
  build,
};
