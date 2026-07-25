import { Container, Graphics } from "pixi.js";
import {
  JimaTimeline,
  makeText,
  outQuad,
  outQuint,
  inQuad,
  makeOutBack,
  safeRect,
  type BuiltTemplate,
  type FontRegistry,
  type FontRole,
  type Palette,
  type TemplateContext,
  type TemplateDefinition,
} from "@jima/engine";

const str = (v: unknown, fallback: string): string =>
  typeof v === "string" && v.length > 0 ? v : fallback;

/** Largest size <= size at which `text` fits maxWidth (crisp, single-line). */
function fitSize(
  fonts: FontRegistry,
  text: string,
  role: FontRole,
  weight: number,
  size: number,
  maxWidth: number,
): number {
  if (text.length === 0 || maxWidth <= 0) return size;
  const w = fonts.measure(text, { family: fonts.family(role), weight, size });
  return w > maxWidth ? Math.max(10, Math.floor((size * maxWidth) / w)) : size;
}

// All-light palettes on purpose: the piece is a light-mode Control Center drop,
// the owner's explicit brief. `panelColor` is the tile, `accent` the airplane-
// mode "on" fill (iOS orange family), `textColor` the title ink on `background`.
const PALETTES: Palette[] = [
  { id: "daylight", name: "Daylight", colors: { background: "#F4F5F8", panelColor: "#FFFFFF", textColor: "#15171C", accent: "#F28900" } },
  { id: "cabin-sky", name: "Cabin sky", colors: { background: "#E9F2FD", panelColor: "#FFFFFF", textColor: "#12283E", accent: "#E8720C" } },
  { id: "boarding-cream", name: "Boarding cream", colors: { background: "#F9F3E8", panelColor: "#FFFFFF", textColor: "#271F15", accent: "#D95E0F" } },
  { id: "terminal-mist", name: "Terminal mist", colors: { background: "#EFEFF4", panelColor: "#FBFBFD", textColor: "#131417", accent: "#EA7A18" } },
];

// iOS system colors for the other radios (fixed, not palette-driven — they read
// as "the phone UI", while the palette drives the frame around it).
const IOS_GREEN = "#34C759";
const IOS_BLUE = "#0A84FF";
const CIRCLE_OFF = "#E9E9EE"; // inactive button fill (light mode)
const ICON_OFF = "#3A3A41"; // inactive glyph ink
const ICON_DIM = "#B9B9C2"; // radios after airplane mode kills them

// --- Choreography (seconds; duration is a fixed constant) ---
const DROP_START = 0.05;
const DROP_DUR = 0.95;
const PRESS_AT = 1.45; // finger-down
const PRESS_DUR = 0.13;
const RELEASE_AT = 1.66; // heavy bouncy release + orange activation
const RADIOS_AT = 1.82; // wifi/cellular/bluetooth give up
const PILL_AT = 2.02;
const TAKEOFF_AT = 2.5; // vertical lift, well clear of the tile
const CLIMB_AT = 3.0; // main accelerating exit
const CLIMB_DUR = 1.35;
const PILL_OUT_AT = 3.28;
const TITLE_AT = 3.55;
const SUB_AT = 3.78;
const ICON_BACK_AT = 4.35; // the button gets its glyph back for the end card
const DURATION = 4.8;

/**
 * Solid airplane-mode silhouette pointing UP, centred at (0,0), wingspan ~= s.
 * Drawn (not the shared paper-plane icon) so it reads as the iOS glyph.
 */
function makeAirplane(s: number, color: string): Graphics {
  const g = new Graphics();
  // fuselage (nose at -0.5s, tail at 0.42s)
  g.moveTo(0, -0.5 * s)
    .bezierCurveTo(0.085 * s, -0.38 * s, 0.075 * s, -0.2 * s, 0.07 * s, -0.05 * s)
    .lineTo(0.07 * s, 0.3 * s)
    .quadraticCurveTo(0.05 * s, 0.42 * s, 0, 0.42 * s)
    .quadraticCurveTo(-0.05 * s, 0.42 * s, -0.07 * s, 0.3 * s)
    .lineTo(-0.07 * s, -0.05 * s)
    .bezierCurveTo(-0.075 * s, -0.2 * s, -0.085 * s, -0.38 * s, 0, -0.5 * s)
    .fill(color);
  // main wings (swept slightly back)
  g.poly([
    0.06 * s, -0.14 * s,
    0.5 * s, 0.1 * s,
    0.5 * s, 0.2 * s,
    0.06 * s, 0.08 * s,
  ]).fill(color);
  g.poly([
    -0.06 * s, -0.14 * s,
    -0.5 * s, 0.1 * s,
    -0.5 * s, 0.2 * s,
    -0.06 * s, 0.08 * s,
  ]).fill(color);
  // tailplane
  g.poly([0.05 * s, 0.3 * s, 0.22 * s, 0.44 * s, 0.22 * s, 0.5 * s, 0.04 * s, 0.42 * s]).fill(color);
  g.poly([-0.05 * s, 0.3 * s, -0.22 * s, 0.44 * s, -0.22 * s, 0.5 * s, -0.04 * s, 0.42 * s]).fill(color);
  return g;
}

/** WiFi glyph: 3 arcs + dot, centred, pointing up. */
function makeWifi(s: number, color: string): Graphics {
  const g = new Graphics();
  const cxy = 0.32 * s; // arc centre sits low so the fan points up
  for (let i = 0; i < 3; i++) {
    const r = (0.28 + i * 0.22) * s;
    g.arc(0, cxy, r, Math.PI * 1.28, Math.PI * 1.72).stroke({ width: 0.11 * s, color, cap: "round" });
  }
  g.circle(0, cxy - 0.02 * s, 0.075 * s).fill(color);
  return g;
}

/** Bluetooth rune: stroked polyline, centred. */
function makeBluetooth(s: number, color: string): Graphics {
  const g = new Graphics();
  const wdt = { width: 0.1 * s, color, cap: "round" as const, join: "round" as const };
  g.moveTo(0, -0.5 * s).lineTo(0, 0.5 * s).stroke(wdt);
  g.moveTo(0, -0.5 * s).lineTo(0.26 * s, -0.26 * s).lineTo(-0.26 * s, 0.26 * s).stroke(wdt);
  g.moveTo(0, 0.5 * s).lineTo(0.26 * s, 0.26 * s).lineTo(-0.26 * s, -0.26 * s).stroke(wdt);
  return g;
}

/** Cellular bars: 4 ascending rounded bars, centred. */
function makeCellular(s: number, color: string): Graphics {
  const g = new Graphics();
  const bw = 0.16 * s;
  const gap = 0.09 * s;
  const total = 4 * bw + 3 * gap;
  for (let i = 0; i < 4; i++) {
    const bh = (0.3 + i * 0.22) * s;
    g.roundRect(-total / 2 + i * (bw + gap), 0.5 * s - bh, bw, bh, bw * 0.4).fill(color);
  }
  return g;
}

/** Soft multi-pass shadow (thick single layers band into grey outlines on white). */
function softShadow(w: number, h: number, r: number): Container {
  const c = new Container();
  for (let i = 7; i >= 1; i--) {
    const grow = i * 7;
    const g = new Graphics()
      .roundRect(-w / 2 - grow, -h / 2 - grow + i * 3.2, w + grow * 2, h + grow * 2, r + grow)
      .fill({ color: "#0B0E14", alpha: 0.022 });
    c.addChild(g);
  }
  return c;
}

function build(ctx: TemplateContext): BuiltTemplate {
  const { root, size, values, palette, fonts, aspect } = ctx;
  const pc = (k: string, d: string): string => palette.colors[k] ?? d;
  const bg = str(values.background, pc("background", "#F4F5F8"));
  const panelColor = str(values.panelColor, pc("panelColor", "#FFFFFF"));
  const textColor = str(values.textColor, pc("textColor", "#15171C"));
  const accent = str(values.accent, pc("accent", "#F28900"));

  const title = str(values.title, "");
  const subline = str(values.subline, "");
  // "" (not the default) so a cleared field actually removes the pill.
  const label = str(values.label, "");
  const showLabel = values.showLabel !== false;
  const showShadow = values.showShadow !== false;

  const w = size.width;
  const h = size.height;
  const minDim = Math.min(w, h);
  const zone = safeRect(aspect);
  const cx = w / 2;

  const bgRect = new Graphics().rect(0, 0, w, h).fill(bg);
  bgRect.label = "bg";
  root.addChild(bgRect);

  const timeline = new JimaTimeline();

  // --- Geometry ---
  const tile = Math.min(minDim * 0.44, zone.width * 0.7);
  const pad = tile * 0.095;
  const gap = tile * 0.09;
  const d = (tile - 2 * pad - gap) / 2; // circle diameter
  const iconS = d * 0.52;
  const tileR = tile * 0.235;
  const panelCy = zone.y + zone.height * (aspect === "16:9" ? 0.42 : 0.4);

  // --- Panel group (drops in as one) ---
  const panelGroup = new Container();
  panelGroup.position.set(cx, panelCy);
  root.addChild(panelGroup);

  if (showShadow) {
    const shadow = softShadow(tile, tile, tileR);
    shadow.alpha = 0;
    panelGroup.addChild(shadow);
    timeline.to(shadow, { prop: "alpha", from: 0, to: 1, start: DROP_START + 0.35, duration: 0.5, ease: outQuad });
  }

  const plate = new Graphics().roundRect(-tile / 2, -tile / 2, tile, tile, tileR).fill(panelColor);
  panelGroup.addChild(plate);

  // Button positions (2x2)
  const off = (d + gap) / 2;
  const positions: [number, number][] = [
    [-off, -off], // airplane
    [off, -off], // cellular
    [-off, off], // wifi
    [off, off], // bluetooth
  ];

  // --- Airplane button (the hero) ---
  const btn = new Container();
  btn.position.set(positions[0]![0], positions[0]![1]);
  panelGroup.addChild(btn);

  const circleOff = new Graphics().circle(0, 0, d / 2).fill(CIRCLE_OFF);
  const circleOn = new Graphics().circle(0, 0, d / 2).fill(accent);
  circleOn.alpha = 0;
  const planeOff = makeAirplane(iconS, ICON_OFF);
  const planeOn = makeAirplane(iconS, "#FFFFFF");
  planeOn.alpha = 0;
  btn.addChild(circleOff, circleOn, planeOff, planeOn);

  // --- Radio buttons (active, then dimmed by airplane mode) ---
  const radios: { onLayer: Container; offLayer: Container }[] = [];
  const radioSpecs: { pos: [number, number]; fill: string; glyph: (s: number, c: string) => Graphics }[] = [
    { pos: positions[1]!, fill: IOS_GREEN, glyph: makeCellular },
    { pos: positions[2]!, fill: IOS_BLUE, glyph: makeWifi },
    { pos: positions[3]!, fill: IOS_BLUE, glyph: makeBluetooth },
  ];
  for (const spec of radioSpecs) {
    const holder = new Container();
    holder.position.set(spec.pos[0], spec.pos[1]);
    panelGroup.addChild(holder);
    const offLayer = new Container();
    offLayer.addChild(new Graphics().circle(0, 0, d / 2).fill(CIRCLE_OFF), spec.glyph(iconS, ICON_DIM));
    const onLayer = new Container();
    onLayer.addChild(new Graphics().circle(0, 0, d / 2).fill(spec.fill), spec.glyph(iconS, "#FFFFFF"));
    holder.addChild(offLayer, onLayer);
    radios.push({ onLayer, offLayer });
  }

  // --- Drop in (slightly bouncy, smooth) ---
  const fromY = -(tile / 2 + 120);
  timeline.to(panelGroup, { prop: "y", from: fromY, to: panelCy, start: DROP_START, duration: DROP_DUR, ease: makeOutBack(1.3) });
  timeline.to(panelGroup, { prop: "alpha", from: 0, to: 1, start: DROP_START, duration: 0.4, ease: outQuad });

  // --- Press (heavy) ---
  timeline
    .to(btn, { prop: "scale.x", from: 1, to: 0.82, start: PRESS_AT, duration: PRESS_DUR, ease: outQuad })
    .to(btn, { prop: "scale.y", from: 1, to: 0.82, start: PRESS_AT, duration: PRESS_DUR, ease: outQuad })
    .to(btn, { prop: "scale.x", from: 0.82, to: 1, start: RELEASE_AT, duration: 0.5, ease: makeOutBack(2.9) })
    .to(btn, { prop: "scale.y", from: 0.82, to: 1, start: RELEASE_AT, duration: 0.5, ease: makeOutBack(2.9) });
  // the whole panel feels the impact
  timeline
    .to(panelGroup, { prop: "scale.x", from: 1, to: 0.984, start: RELEASE_AT - 0.02, duration: 0.09, ease: outQuad })
    .to(panelGroup, { prop: "scale.y", from: 1, to: 0.984, start: RELEASE_AT - 0.02, duration: 0.09, ease: outQuad })
    .to(panelGroup, { prop: "scale.x", from: 0.984, to: 1, start: RELEASE_AT + 0.07, duration: 0.42, ease: makeOutBack(2.2) })
    .to(panelGroup, { prop: "scale.y", from: 0.984, to: 1, start: RELEASE_AT + 0.07, duration: 0.42, ease: makeOutBack(2.2) });
  // orange activation
  timeline
    .to(circleOn, { prop: "alpha", from: 0, to: 1, start: RELEASE_AT - 0.04, duration: 0.2, ease: outQuad })
    .to(planeOn, { prop: "alpha", from: 0, to: 1, start: RELEASE_AT - 0.04, duration: 0.2, ease: outQuad })
    .to(planeOff, { prop: "alpha", from: 1, to: 0, start: RELEASE_AT - 0.04, duration: 0.16, ease: outQuad });
  // airplane mode kills the radios (the grey layer beneath is revealed)
  for (const r of radios) {
    timeline.to(r.onLayer, { prop: "alpha", from: 1, to: 0, start: RADIOS_AT, duration: 0.45, ease: outQuad });
  }

  // --- "Flight Mode: On" pill ---
  const pillY = tile / 2 + minDim * 0.062;
  if (showLabel && label.length > 0) {
    const pillTextSize = Math.round(minDim * 0.026);
    const pillText = makeText(fonts, { text: label, role: "body", weight: 600, size: pillTextSize, color: textColor, anchor: 0.5 });
    const pw = fonts.measure(label, { family: fonts.family("body"), weight: 600, size: pillTextSize }) + pillTextSize * 2.1;
    const ph = pillTextSize * 2.05;
    const pill = new Container();
    pill.position.set(0, pillY);
    const pillBgS = softShadow(pw, ph, ph / 2);
    pillBgS.alpha = 0.6;
    pill.addChild(pillBgS, new Graphics().roundRect(-pw / 2, -ph / 2, pw, ph, ph / 2).fill(panelColor), pillText);
    panelGroup.addChild(pill);
    pill.alpha = 0;
    timeline
      .to(pill, { prop: "alpha", from: 0, to: 1, start: PILL_AT, duration: 0.28, ease: outQuad })
      .to(pill, { prop: "scale.x", from: 0.7, to: 1, start: PILL_AT, duration: 0.5, ease: makeOutBack(1.9) })
      .to(pill, { prop: "scale.y", from: 0.7, to: 1, start: PILL_AT, duration: 0.5, ease: makeOutBack(1.9) })
      .to(pill, { prop: "alpha", from: 1, to: 0, start: PILL_OUT_AT, duration: 0.3, ease: outQuad })
      .to(pill, { prop: "y", from: pillY, to: pillY + minDim * 0.012, start: PILL_OUT_AT, duration: 0.3, ease: outQuad });
  }

  // --- Takeoff: the button's plane lifts, grows, and exits up-right ---
  const bx = cx - off;
  const by = panelCy - off;
  const flyer = new Container();
  flyer.position.set(bx, by);
  flyer.alpha = 0;
  const flyerPlane = makeAirplane(iconS, accent);
  flyer.addChild(flyerPlane);
  root.addChild(flyer);

  const liftDur = CLIMB_AT - TAKEOFF_AT;
  const liftY = by - tile * 0.62; // visibly OFF the tile before the bank-away
  const exitX = w + iconS * 3.2;
  const exitY = -iconS * 3.2;
  // glyph points up; rotate to face the climb direction
  const rot = Math.atan2(exitX - bx, -(exitY - liftY));

  timeline
    .to(flyer, { prop: "alpha", from: 0, to: 1, start: TAKEOFF_AT, duration: 0.12, ease: outQuad })
    .to(planeOn, { prop: "alpha", from: 1, to: 0, start: TAKEOFF_AT + 0.02, duration: 0.14, ease: outQuad })
    // phase 1 — a real vertical lift: the plane rises clear of the button and
    // tile (an accelerating exit straight from the button reads as an orange
    // blob overlapping the orange circle — verified frame-by-frame)
    .to(flyer, { prop: "y", from: by, to: liftY, start: TAKEOFF_AT, duration: liftDur, ease: outQuad })
    .to(flyer, { prop: "rotation", from: 0, to: rot * 0.22, start: TAKEOFF_AT + 0.05, duration: liftDur, ease: outQuad })
    .to(flyer, { prop: "scale.x", from: 1, to: 2.2, start: TAKEOFF_AT, duration: liftDur, ease: outQuad })
    .to(flyer, { prop: "scale.y", from: 1, to: 2.2, start: TAKEOFF_AT, duration: liftDur, ease: outQuad })
    // phase 2 — banks into the climb and accelerates out of frame
    .to(flyer, { prop: "x", from: bx, to: exitX, start: CLIMB_AT, duration: CLIMB_DUR, ease: inQuad })
    .to(flyer, { prop: "y", from: liftY, to: exitY, start: CLIMB_AT, duration: CLIMB_DUR, ease: inQuad })
    .to(flyer, { prop: "rotation", from: rot * 0.22, to: rot, start: CLIMB_AT, duration: 0.55, ease: outQuad })
    .to(flyer, { prop: "scale.x", from: 2.2, to: 5.4, start: CLIMB_AT, duration: CLIMB_DUR, ease: inQuad })
    .to(flyer, { prop: "scale.y", from: 2.2, to: 5.4, start: CLIMB_AT, duration: CLIMB_DUR, ease: inQuad });

  // the button quietly gets its glyph back for the end card
  timeline.to(planeOn, { prop: "alpha", from: 0, to: 1, start: ICON_BACK_AT, duration: 0.24, ease: outQuad });

  // --- Title / subline (the vlog intro card) ---
  const titleSize = fitSize(fonts, title, "display", 700, Math.round(minDim * 0.058), zone.width * 0.86);
  const titleY = panelCy + tile / 2 + minDim * (showLabel ? 0.115 : 0.095);
  if (title.length > 0) {
    const t = makeText(fonts, { text: title, role: "display", weight: 700, size: titleSize, color: textColor, anchor: 0.5, align: "center" });
    t.position.set(cx, titleY);
    t.alpha = 0;
    root.addChild(t);
    timeline
      .to(t, { prop: "alpha", from: 0, to: 1, start: TITLE_AT, duration: 0.55, ease: outQuad })
      .to(t, { prop: "y", from: titleY + minDim * 0.022, to: titleY, start: TITLE_AT, duration: 0.6, ease: outQuint });
  }
  if (subline.length > 0) {
    const subSize = fitSize(fonts, subline, "body", 500, Math.round(minDim * 0.03), zone.width * 0.8);
    const subY = titleY + titleSize * 0.62 + subSize * 0.9;
    const s2 = makeText(fonts, { text: subline, role: "body", weight: 500, size: subSize, color: textColor, anchor: 0.5, align: "center" });
    s2.position.set(cx, subY);
    s2.alpha = 0;
    root.addChild(s2);
    timeline
      .to(s2, { prop: "alpha", from: 0, to: 0.72, start: SUB_AT, duration: 0.55, ease: outQuad })
      .to(s2, { prop: "y", from: subY + minDim * 0.018, to: subY, start: SUB_AT, duration: 0.6, ease: outQuint });
  }

  return { timeline, duration: DURATION };
}

export const flightMode: TemplateDefinition = {
  id: "flight-mode",
  name: "Flight Mode",
  tagline: "The Control Center drops in, Flight Mode thumps on, and the plane takes off — your travel vlog begins.",
  category: "travel",
  aspects: ["1:1", "4:5", "9:16", "16:9"],
  defaultAspect: "16:9",
  loopable: false,
  posterTime: 4.6,
  palettes: PALETTES,
  fields: [
    { key: "title", type: "text", label: "Title", default: "Off to Tokyo", maxLength: 34, shrinkToFit: true, optional: true },
    { key: "subline", type: "text", label: "Subline", default: "A travel film · Part 1", maxLength: 44, shrinkToFit: true, optional: true },
    { key: "label", type: "text", label: "Status label", default: "Flight Mode: On", maxLength: 24, shrinkToFit: true, optional: true },
    { key: "background", type: "color", label: "Background", default: "", optional: true },
    { key: "panelColor", type: "color", label: "Panel", default: "", optional: true },
    { key: "textColor", type: "color", label: "Text", default: "", optional: true },
    { key: "accent", type: "color", label: "Flight Mode color", default: "", optional: true },
    { key: "showLabel", type: "toggle", label: "Status pill", default: true },
    { key: "showShadow", type: "toggle", label: "Soft shadow", default: true },
  ],
  build,
};
