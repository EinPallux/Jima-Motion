import type { JimaTimeline, TimelineBeat } from "../timeline/timeline";

// A sound cue = a synthesized SFX fired at a moment in the timeline. Cues are
// derived from the timeline's motion "beats" so the audio fits what happens on
// screen (a springy entrance → a pop; a slide → a swoosh; the settle → a ding).
// Pure and deterministic; sound never affects the visual render or golden frames.

export type SoundName = "pop" | "tap" | "swoosh" | "whoosh" | "tick" | "ding" | "thud" | "sparkle";

export interface SoundCue {
  time: number;
  sound: SoundName;
  gain: number;
}

/** Logical-px travel that counts as a real slide (canvas is 1080–1920 px). */
const MOVE_THRESHOLD = 60;

function classify(b: TimelineBeat): SoundCue | null {
  if (b.overshoot && b.scaleFromSmall) return { time: b.time, sound: "pop", gain: 0.75 };
  if (b.scaleFromSmall && b.moveDist > MOVE_THRESHOLD) return { time: b.time, sound: "whoosh", gain: 0.6 };
  if (b.scaleFromSmall) return { time: b.time, sound: "tap", gain: 0.52 };
  if (b.moveDist > MOVE_THRESHOLD) return { time: b.time, sound: "swoosh", gain: 0.55 };
  if (b.rotate) return { time: b.time, sound: "swoosh", gain: 0.45 };
  if (b.overshoot) return { time: b.time, sound: "tap", gain: 0.5 };
  if (b.fadeIn) return { time: b.time, sound: "tick", gain: 0.32 };
  return null;
}

/** Keep at most `max` cues, dropping the softest first but always keeping the ding. */
function cap(cues: SoundCue[], max: number): SoundCue[] {
  if (cues.length <= max) return cues;
  const dings = cues.filter((c) => c.sound === "ding");
  const rest = cues.filter((c) => c.sound !== "ding").sort((a, b) => b.gain - a.gain);
  return [...dings, ...rest.slice(0, Math.max(0, max - dings.length))].sort((a, b) => a.time - b.time);
}

/** Build a fitting cue sheet from a timeline's beats + total duration. */
export function cuesFromBeats(beats: TimelineBeat[], duration: number): SoundCue[] {
  const raw = beats.map(classify).filter((c): c is SoundCue => c !== null).sort((a, b) => a.time - b.time);

  // Thin near-simultaneous cues; soften rapid staggered runs.
  const thinned: SoundCue[] = [];
  let last = -1;
  for (const c of raw) {
    if (c.time - last < 0.045) continue;
    const rapid = last >= 0 && c.time - last < 0.14;
    thinned.push({ ...c, gain: rapid ? c.gain * 0.6 : c.gain });
    last = c.time;
  }

  // A resolve chime as the motion settles (skip if a cue already lands there).
  const resolve = Math.max(0, duration - 0.55);
  const out = thinned.filter((c) => Math.abs(c.time - resolve) > 0.12);
  out.push({ time: resolve, sound: "ding", gain: 0.5 });
  out.sort((a, b) => a.time - b.time);
  return cap(out, 28);
}

/** Convenience: derive cues straight from a timeline. */
export function cuesFromTimeline(timeline: JimaTimeline, duration: number): SoundCue[] {
  return cuesFromBeats(timeline.beats(), duration);
}
