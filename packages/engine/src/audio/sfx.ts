import { mulberry32 } from "../timeline/rng";
import type { SoundCue, SoundName } from "./cues";

// Procedural SFX synthesized with the Web Audio API — no sample files to bundle,
// license, or fetch (CSP-safe). The same recipe graph runs live (AudioContext)
// for preview and offline (OfflineAudioContext) to bake an audio track for
// export. Noise is seeded, so a given cue sheet always renders the same audio.

export type SoundPack = "pop" | "soft" | "retro";

export const SOUND_PACKS: { id: SoundPack; label: string }[] = [
  { id: "pop", label: "Pop" },
  { id: "soft", label: "Soft" },
  { id: "retro", label: "Retro" },
];

const noiseCache = new WeakMap<BaseAudioContext, AudioBuffer>();
function noise(ctx: BaseAudioContext): AudioBuffer {
  const cached = noiseCache.get(ctx);
  if (cached) return cached;
  const len = Math.max(1, Math.floor(ctx.sampleRate * 0.6));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  const rng = mulberry32(0x9e3779b1);
  for (let i = 0; i < len; i++) data[i] = rng() * 2 - 1;
  noiseCache.set(ctx, buf);
  return buf;
}

/** Attack/decay gain envelope (exponential; never ramps to exactly 0). */
function envelope(node: GainNode, when: number, attack: number, decay: number, peak: number): void {
  const g = node.gain;
  g.setValueAtTime(0.0001, when);
  g.exponentialRampToValueAtTime(Math.max(0.0002, peak), when + attack);
  g.exponentialRampToValueAtTime(0.0001, when + attack + decay);
}

function osc(ctx: BaseAudioContext, type: OscillatorType, dest: AudioNode): { o: OscillatorNode; g: GainNode } {
  const o = ctx.createOscillator();
  o.type = type;
  const g = ctx.createGain();
  o.connect(g).connect(dest);
  return { o, g };
}

function noiseSweep(
  ctx: BaseAudioContext,
  when: number,
  filter: BiquadFilterType,
  f0: number,
  f1: number,
  q: number,
  attack: number,
  decay: number,
  gain: number,
  dest: AudioNode,
): void {
  const src = ctx.createBufferSource();
  src.buffer = noise(ctx);
  const bf = ctx.createBiquadFilter();
  bf.type = filter;
  bf.Q.value = q;
  bf.frequency.setValueAtTime(f0, when);
  bf.frequency.exponentialRampToValueAtTime(f1, when + attack + decay);
  const g = ctx.createGain();
  envelope(g, when, attack, decay, gain);
  src.connect(bf).connect(g).connect(dest);
  src.start(when);
  src.stop(when + attack + decay + 0.05);
}

/** Build the Web Audio graph for one sound at time `when`, into `dest`. */
export function renderSound(
  ctx: BaseAudioContext,
  name: SoundName,
  when: number,
  gain: number,
  dest: AudioNode,
  pack: SoundPack = "pop",
): void {
  const retro = pack === "retro";
  const soft = pack === "soft";
  const wave: OscillatorType = retro ? "square" : soft ? "sine" : "triangle";

  switch (name) {
    case "pop": {
      const { o, g } = osc(ctx, wave, dest);
      o.frequency.setValueAtTime(soft ? 440 : 540, when);
      o.frequency.exponentialRampToValueAtTime(soft ? 200 : 170, when + 0.09);
      envelope(g, when, 0.004, soft ? 0.16 : 0.12, gain);
      o.start(when);
      o.stop(when + 0.2);
      break;
    }
    case "tap": {
      const { o, g } = osc(ctx, wave, dest);
      o.frequency.setValueAtTime(360, when);
      o.frequency.exponentialRampToValueAtTime(250, when + 0.05);
      envelope(g, when, 0.003, 0.08, gain * 0.9);
      o.start(when);
      o.stop(when + 0.14);
      break;
    }
    case "tick": {
      if (retro) {
        const { o, g } = osc(ctx, "square", dest);
        o.frequency.setValueAtTime(1400, when);
        envelope(g, when, 0.001, 0.03, gain);
        o.start(when);
        o.stop(when + 0.05);
      } else {
        noiseSweep(ctx, when, "highpass", 3000, 5000, 0.7, 0.001, 0.03, gain * 1.1, dest);
      }
      break;
    }
    case "swoosh": {
      if (retro) {
        const { o, g } = osc(ctx, "square", dest);
        o.frequency.setValueAtTime(300, when);
        o.frequency.exponentialRampToValueAtTime(1400, when + 0.16);
        envelope(g, when, 0.01, 0.16, gain * 0.7);
        o.start(when);
        o.stop(when + 0.2);
      } else {
        noiseSweep(ctx, when, "bandpass", 500, 2400, 0.8, 0.02, 0.18, gain, dest);
      }
      break;
    }
    case "whoosh": {
      if (retro) {
        const { o, g } = osc(ctx, "square", dest);
        o.frequency.setValueAtTime(180, when);
        o.frequency.exponentialRampToValueAtTime(1200, when + 0.3);
        envelope(g, when, 0.03, 0.3, gain * 0.7);
        o.start(when);
        o.stop(when + 0.36);
      } else {
        noiseSweep(ctx, when, "lowpass", 400, 3200, 0.6, 0.03, 0.3, gain, dest);
      }
      break;
    }
    case "ding": {
      const base = soft ? 780 : 880;
      for (const [mult, amp] of [[1, 1], [1.5, 0.45]] as const) {
        const { o, g } = osc(ctx, retro ? "square" : "sine", dest);
        o.frequency.setValueAtTime(base * mult, when);
        envelope(g, when, 0.005, soft ? 0.7 : 0.55, gain * amp);
        o.start(when);
        o.stop(when + 0.8);
      }
      break;
    }
    case "thud": {
      const { o, g } = osc(ctx, "sine", dest);
      o.frequency.setValueAtTime(120, when);
      o.frequency.exponentialRampToValueAtTime(55, when + 0.09);
      envelope(g, when, 0.004, 0.18, gain);
      o.start(when);
      o.stop(when + 0.24);
      break;
    }
    case "sparkle": {
      const notes = [720, 1020, 1440];
      notes.forEach((f, i) => {
        const t = when + i * 0.045;
        const { o, g } = osc(ctx, retro ? "square" : "sine", dest);
        o.frequency.setValueAtTime(f, t);
        envelope(g, t, 0.003, 0.09, gain * 0.6);
        o.start(t);
        o.stop(t + 0.14);
      });
      break;
    }
  }
}

/**
 * Realtime SFX player for the Studio preview. Fire cues as the playhead crosses
 * them; needs a user gesture to unlock audio (browser autoplay policy).
 */
export class SfxPlayer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private pack: SoundPack;
  private volume: number;

  constructor(opts: { pack?: SoundPack; volume?: number } = {}) {
    this.pack = opts.pack ?? "pop";
    this.volume = opts.volume ?? 0.7;
  }

  private ensure(): AudioContext | null {
    if (typeof window === "undefined" || typeof AudioContext === "undefined") return null;
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  /** Resume the audio context (call from a user gesture, e.g. pressing play). */
  async resume(): Promise<void> {
    const ctx = this.ensure();
    if (ctx && ctx.state === "suspended") await ctx.resume();
  }

  setPack(pack: SoundPack): void {
    this.pack = pack;
  }
  setVolume(v: number): void {
    this.volume = v;
    if (this.master) this.master.gain.value = v;
  }

  /** Play one cue now. */
  play(sound: SoundName, gain = 0.6): void {
    const ctx = this.ctx;
    if (!ctx || !this.master || ctx.state !== "running") return;
    renderSound(ctx, sound, ctx.currentTime + 0.001, gain, this.master, this.pack);
  }

  destroy(): void {
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      this.master = null;
    }
  }
}

/**
 * Bake a cue sheet into an AudioBuffer offline (for muxing into an export).
 * `speed` compresses the timeline (cue times ÷ speed); `duration` is the source
 * timeline length. Returns null where OfflineAudioContext is unavailable.
 */
export async function renderCuesToBuffer(
  cues: SoundCue[],
  duration: number,
  opts: { speed?: number; pack?: SoundPack; volume?: number; sampleRate?: number } = {},
): Promise<AudioBuffer | null> {
  if (typeof OfflineAudioContext === "undefined") return null;
  const speed = opts.speed && opts.speed > 0 ? opts.speed : 1;
  const sampleRate = opts.sampleRate ?? 44100;
  const outDur = Math.max(0.1, duration / speed + 0.8); // tail room for the ding
  const ctx = new OfflineAudioContext(2, Math.ceil(outDur * sampleRate), sampleRate);
  const master = ctx.createGain();
  master.gain.value = opts.volume ?? 0.7;
  master.connect(ctx.destination);
  const pack = opts.pack ?? "pop";
  for (const cue of cues) {
    const when = cue.time / speed;
    if (when >= 0 && when < outDur) renderSound(ctx, cue.sound, when, cue.gain, master, pack);
  }
  return ctx.startRendering();
}
