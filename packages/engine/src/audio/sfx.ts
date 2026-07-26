import { mulberry32 } from "../timeline/rng";
import type { SoundCue, SoundName } from "./cues";
import type { SoundProfile } from "./profile";
import { voicesForCue, cueTail, type SoundPack, type VoiceSpec } from "./voices";

export { SOUND_PACKS, type SoundPack, type VoiceSpec } from "./voices";

// Procedural SFX synthesized with the Web Audio API — no sample files to bundle,
// license, or fetch (CSP-safe). The same graph runs live (AudioContext) for the
// preview and offline (OfflineAudioContext) to bake an export's audio track.
// Noise and the reverb impulse are seeded, so a cue sheet always renders the same.

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const whiteCache = new WeakMap<BaseAudioContext, AudioBuffer>();
const pinkCache = new WeakMap<BaseAudioContext, AudioBuffer>();

function whiteNoise(ctx: BaseAudioContext): AudioBuffer {
  const cached = whiteCache.get(ctx);
  if (cached) return cached;
  const len = Math.max(1, Math.floor(ctx.sampleRate * 1.2));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  const rng = mulberry32(0x9e3779b1);
  for (let i = 0; i < len; i++) data[i] = rng() * 2 - 1;
  whiteCache.set(ctx, buf);
  return buf;
}

/**
 * Pink noise (Paul Kellet's economy filter). Air, whooshes and cloth all live in
 * pink — white noise for those reads as tape hiss and is the single most
 * "cheap synth" tell in a UI sound set.
 */
function pinkNoise(ctx: BaseAudioContext): AudioBuffer {
  const cached = pinkCache.get(ctx);
  if (cached) return cached;
  const len = Math.max(1, Math.floor(ctx.sampleRate * 1.2));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  const rng = mulberry32(0x2545f491);
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;
  for (let i = 0; i < len; i++) {
    const w = rng() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.969 * b2 + w * 0.153852;
    b3 = 0.8665 * b3 + w * 0.3104856;
    b4 = 0.55 * b4 + w * 0.5329522;
    b5 = -0.7616 * b5 - w * 0.016898;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
    b6 = w * 0.115926;
  }
  pinkCache.set(ctx, buf);
  return buf;
}

// ---------------------------------------------------------------------------
// Master chain
// ---------------------------------------------------------------------------

const irCache = new WeakMap<BaseAudioContext, AudioBuffer>();

/**
 * A small procedural room: decorrelated noise under an exponential decay, with a
 * short pre-delay. Generated, not sampled, so there is still nothing to fetch or
 * license. Everything tonal gets a send — space is what separates a sound that
 * was designed from one that was merely synthesized.
 */
function roomImpulse(ctx: BaseAudioContext): AudioBuffer {
  const cached = irCache.get(ctx);
  if (cached) return cached;
  const sr = ctx.sampleRate;
  const seconds = 1.1;
  const len = Math.max(1, Math.floor(sr * seconds));
  const buf = ctx.createBuffer(2, len, sr);
  const preDelay = Math.floor(sr * 0.012);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    const rng = mulberry32(ch === 0 ? 0x1b873593 : 0xcc9e2d51);
    // One-pole lowpass over the noise: a bright tail hisses, a dark one sits
    // behind the dry hit where it belongs.
    let lp = 0;
    for (let i = 0; i < len; i++) {
      if (i < preDelay) {
        data[i] = 0;
        continue;
      }
      const u = (i - preDelay) / (len - preDelay);
      const w = rng() * 2 - 1;
      lp += (w - lp) * 0.22;
      data[i] = lp * Math.pow(1 - u, 2.6);
    }
  }
  irCache.set(ctx, buf);
  return buf;
}

export interface MasterChain {
  /** Dry input — voices connect here. */
  dry: GainNode;
  /** Reverb send — voices connect here through their own send gain. */
  wet: GainNode;
  /** Final output level, so a live player can change volume after wiring. */
  out: GainNode;
}

/**
 * Build the shared output chain.
 *
 * The limiter is not optional polish: a dozen cues can land within a few frames
 * of each other, and without it the sum clipped. The high-pass removes the DC
 * and sub-30 Hz rumble that the noise sources and the sub voice produce, which
 * otherwise eats headroom you cannot hear.
 */
export function createMaster(ctx: BaseAudioContext, volume: number): MasterChain {
  const out = ctx.createGain();
  out.gain.value = volume;

  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -8;
  limiter.knee.value = 6;
  limiter.ratio.value = 12;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.16;

  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 34;
  hp.Q.value = 0.7;

  hp.connect(limiter).connect(out).connect(ctx.destination);

  const dry = ctx.createGain();
  dry.gain.value = 1;
  dry.connect(hp);

  const convolver = ctx.createConvolver();
  convolver.normalize = true;
  convolver.buffer = roomImpulse(ctx);
  const wetTrim = ctx.createGain();
  wetTrim.gain.value = 0.9;
  const wet = ctx.createGain();
  wet.gain.value = 1;
  wet.connect(convolver).connect(wetTrim).connect(hp);

  return { dry, wet, out };
}

// ---------------------------------------------------------------------------
// Voice rendering
// ---------------------------------------------------------------------------

/**
 * Attack → hold → decay, in a shape that never ramps to or from exactly zero
 * (exponential ramps to 0 are illegal) and always ends with a short linear tail
 * to silence, so a decay that is cut short does not click.
 */
function envelope(g: GainNode, when: number, v: VoiceSpec, peak: number): void {
  const p = Math.max(0.0002, peak);
  const a = Math.max(0.0005, v.attack);
  const param = g.gain;
  param.setValueAtTime(0.0001, when);
  param.exponentialRampToValueAtTime(p, when + a);
  if (v.hold > 0) param.setValueAtTime(p, when + a + v.hold);
  param.exponentialRampToValueAtTime(0.0001, when + a + v.hold + v.decay);
  param.linearRampToValueAtTime(0, when + a + v.hold + v.decay + 0.004);
}

function renderVoice(ctx: BaseAudioContext, v: VoiceSpec, when: number, master: MasterChain): void {
  const t = when + v.delay;
  const end = t + v.attack + v.hold + v.decay + 0.02;

  const env = ctx.createGain();
  envelope(env, t, v, v.peak);

  let head: AudioNode = env;
  if (v.filter) {
    const bf = ctx.createBiquadFilter();
    bf.type = v.filter.type;
    bf.Q.value = v.filter.q;
    bf.frequency.setValueAtTime(Math.max(20, v.filter.f0), t);
    if (v.filter.f1 !== v.filter.f0) {
      bf.frequency.exponentialRampToValueAtTime(Math.max(20, v.filter.f1), t + v.attack + v.hold + v.decay);
    }
    env.connect(bf);
    head = bf;
  }

  head.connect(master.dry);
  if (v.room > 0) {
    const send = ctx.createGain();
    send.gain.value = Math.min(1, v.room);
    head.connect(send).connect(master.wet);
  }

  if (v.kind === "noise") {
    const src = ctx.createBufferSource();
    src.buffer = v.pink ? pinkNoise(ctx) : whiteNoise(ctx);
    src.connect(env);
    src.start(t);
    src.stop(end);
  } else {
    const osc = ctx.createOscillator();
    osc.type = v.wave;
    osc.frequency.setValueAtTime(Math.max(20, v.f0), t);
    if (v.f1 !== v.f0) osc.frequency.exponentialRampToValueAtTime(Math.max(20, v.f1), t + v.attack + v.hold + v.decay);
    osc.connect(env);
    osc.start(t);
    osc.stop(end);
    if (v.detune !== 0) {
      const twin = ctx.createOscillator();
      twin.type = v.wave;
      twin.detune.value = v.detune;
      twin.frequency.setValueAtTime(Math.max(20, v.f0), t);
      if (v.f1 !== v.f0) twin.frequency.exponentialRampToValueAtTime(Math.max(20, v.f1), t + v.attack + v.hold + v.decay);
      const twinGain = ctx.createGain();
      twinGain.gain.value = 0.5;
      twin.connect(twinGain).connect(env);
      twin.start(t);
      twin.stop(end);
    }
  }
}

/** Render one cue's full stack of voices at `when` into the master chain. */
export function renderCue(
  ctx: BaseAudioContext,
  cue: SoundCue,
  when: number,
  master: MasterChain,
  pack: SoundPack,
  profile: SoundProfile,
  index = 0,
): void {
  for (const v of voicesForCue(cue, pack, profile, index)) renderVoice(ctx, v, when, master);
}

// ---------------------------------------------------------------------------
// Players
// ---------------------------------------------------------------------------

/**
 * Realtime SFX player for the Studio preview. Fire cues as the playhead crosses
 * them; needs a user gesture to unlock audio (browser autoplay policy).
 */
export class SfxPlayer {
  private ctx: AudioContext | null = null;
  private master: MasterChain | null = null;
  private outGain: GainNode | null = null;
  private pack: SoundPack;
  private profile: SoundProfile;
  private volume: number;
  private fired = 0;

  constructor(opts: { pack?: SoundPack; profile?: SoundProfile; volume?: number } = {}) {
    this.pack = opts.pack ?? "pop";
    this.profile = opts.profile ?? "ui";
    this.volume = opts.volume ?? 0.62;
  }

  private ensure(): AudioContext | null {
    if (typeof window === "undefined" || typeof AudioContext === "undefined") return null;
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = createMaster(this.ctx, this.volume);
      this.outGain = this.master.out;
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
  setProfile(profile: SoundProfile): void {
    this.profile = profile;
  }
  setVolume(v: number): void {
    this.volume = v;
    if (this.outGain) this.outGain.gain.value = v;
  }

  /** Play one cue now. */
  play(cue: SoundCue): void {
    const ctx = this.ctx;
    if (!ctx || !this.master || ctx.state !== "running") return;
    renderCue(ctx, cue, ctx.currentTime + 0.002, this.master, this.pack, this.profile, this.fired++);
  }

  destroy(): void {
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      this.master = null;
      this.outGain = null;
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
  opts: { speed?: number; pack?: SoundPack; profile?: SoundProfile; volume?: number; sampleRate?: number } = {},
): Promise<AudioBuffer | null> {
  if (typeof OfflineAudioContext === "undefined") return null;
  const speed = opts.speed && opts.speed > 0 ? opts.speed : 1;
  const sampleRate = opts.sampleRate ?? 44100;
  const pack = opts.pack ?? "pop";
  const profile = opts.profile ?? "ui";

  // Leave room for the longest tail any cue actually produces plus the room's
  // decay, rather than a fixed guess — a bell in a big room rings for ~1.2s and
  // used to be truncated.
  let tail = 0.4;
  for (const cue of cues) tail = Math.max(tail, cue.time / speed - duration / speed + cueTail(cue, pack, profile) + 1.1);
  const outDur = Math.max(0.1, duration / speed + Math.min(2.2, tail));

  const ctx = new OfflineAudioContext(2, Math.ceil(outDur * sampleRate), sampleRate);
  const master = createMaster(ctx, opts.volume ?? 0.62);
  cues.forEach((cue, i) => {
    const when = cue.time / speed;
    if (when >= 0 && when < outDur) renderCue(ctx, cue, when, master, pack, profile, i);
  });
  return ctx.startRendering();
}

/** Sound names, for exhaustiveness checks in tests. */
export const SOUND_NAMES: SoundName[] = [
  "click",
  "tick",
  "tap",
  "pop",
  "pluck",
  "impact",
  "sub",
  "swish",
  "whoosh",
  "fall",
  "riser",
  "chime",
  "bell",
  "shimmer",
];
