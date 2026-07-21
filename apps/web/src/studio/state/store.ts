import { create } from "zustand";
import {
  resolveValues,
  type Aspect,
  type TemplateDefinition,
  type Values,
} from "@jima/engine";

export interface EditableState {
  templateId: string | null;
  aspect: Aspect;
  paletteId: string | undefined;
  values: Values;
  speed: number;
  loop: boolean;
}

interface StudioStore extends EditableState {
  def: TemplateDefinition | null;
  past: EditableState[];
  future: EditableState[];
  lastEditKey: string | null;
  lastEditAt: number;

  openTemplate: (def: TemplateDefinition, initial?: Partial<EditableState>) => void;
  setValue: (key: string, value: unknown) => void;
  setAspect: (aspect: Aspect) => void;
  setPalette: (paletteId: string | undefined) => void;
  setSpeed: (speed: number) => void;
  setLoop: (loop: boolean) => void;
  reset: () => void;
  undo: () => void;
  redo: () => void;
  close: () => void;
}

const HISTORY_LIMIT = 50;
const COALESCE_MS = 700;

/**
 * Palettes are presets: selecting one fills the template's color fields from the
 * palette's colors (matched by field key). Keeps a single source of truth in
 * `values` so the inspector always shows concrete swatches.
 */
function paletteColorValues(def: TemplateDefinition, paletteId: string | undefined): Values {
  const palette = def.palettes.find((p) => p.id === paletteId) ?? def.palettes[0];
  if (!palette) return {};
  const out: Values = {};
  for (const f of def.fields) {
    if (f.type === "color" && palette.colors[f.key] !== undefined) out[f.key] = palette.colors[f.key];
  }
  return out;
}

function snapshot(s: EditableState): EditableState {
  return {
    templateId: s.templateId,
    aspect: s.aspect,
    paletteId: s.paletteId,
    values: { ...s.values },
    speed: s.speed,
    loop: s.loop,
  };
}

export const useStudio = create<StudioStore>((set, get) => ({
  templateId: null,
  aspect: "1:1",
  paletteId: undefined,
  values: {},
  speed: 1,
  loop: false,
  def: null,
  past: [],
  future: [],
  lastEditKey: null,
  lastEditAt: 0,

  openTemplate: (def, initial) => {
    const paletteId = initial?.paletteId ?? def.palettes[0]?.id;
    const values = initial?.values ?? { ...resolveValues(def), ...paletteColorValues(def, paletteId) };
    set({
      def,
      templateId: def.id,
      aspect: initial?.aspect ?? def.defaultAspect,
      paletteId,
      values,
      speed: initial?.speed ?? 1,
      loop: initial?.loop ?? def.loopable,
      past: [],
      future: [],
      lastEditKey: null,
      lastEditAt: 0,
    });
  },

  setValue: (key, value) => {
    const s = get();
    const now = Date.now();
    const coalesce = s.lastEditKey === key && now - s.lastEditAt < COALESCE_MS;
    set({
      past: coalesce ? s.past : [...s.past, snapshot(s)].slice(-HISTORY_LIMIT),
      future: [],
      values: { ...s.values, [key]: value },
      lastEditKey: key,
      lastEditAt: now,
    });
  },

  setAspect: (aspect) => {
    const s = get();
    if (aspect === s.aspect) return;
    set({ past: [...s.past, snapshot(s)].slice(-HISTORY_LIMIT), future: [], aspect, lastEditKey: null });
  },

  setPalette: (paletteId) => {
    const s = get();
    if (paletteId === s.paletteId || !s.def) return;
    set({
      past: [...s.past, snapshot(s)].slice(-HISTORY_LIMIT),
      future: [],
      paletteId,
      values: { ...s.values, ...paletteColorValues(s.def, paletteId) },
      lastEditKey: null,
    });
  },

  setSpeed: (speed) => {
    const s = get();
    const clamped = Math.max(0.5, Math.min(2, speed));
    if (clamped === s.speed) return;
    set({ past: [...s.past, snapshot(s)].slice(-HISTORY_LIMIT), future: [], speed: clamped, lastEditKey: null });
  },

  setLoop: (loop) => {
    const s = get();
    set({ past: [...s.past, snapshot(s)].slice(-HISTORY_LIMIT), future: [], loop, lastEditKey: null });
  },

  reset: () => {
    const s = get();
    if (!s.def) return;
    set({
      past: [...s.past, snapshot(s)].slice(-HISTORY_LIMIT),
      future: [],
      values: resolveValues(s.def),
      paletteId: s.def.palettes[0]?.id,
      speed: 1,
      lastEditKey: null,
    });
  },

  undo: () => {
    const s = get();
    const prev = s.past[s.past.length - 1];
    if (!prev) return;
    set({
      past: s.past.slice(0, -1),
      future: [snapshot(s), ...s.future].slice(0, HISTORY_LIMIT),
      ...prev,
      lastEditKey: null,
    });
  },

  redo: () => {
    const s = get();
    const next = s.future[0];
    if (!next) return;
    set({
      past: [...s.past, snapshot(s)].slice(-HISTORY_LIMIT),
      future: s.future.slice(1),
      ...next,
      lastEditKey: null,
    });
  },

  close: () => {
    set({ def: null, templateId: null, past: [], future: [], lastEditKey: null });
  },
}));

export function canUndo(s: StudioStore): boolean {
  return s.past.length > 0;
}
export function canRedo(s: StudioStore): boolean {
  return s.future.length > 0;
}
