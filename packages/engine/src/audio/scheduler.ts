import type { SoundCue } from "./cues";
import type { SoundProfile } from "./profile";
import { SfxPlayer, type SoundPack } from "./sfx";

const EPS = 1e-4;

/**
 * Fires SFX cues as a preview playhead crosses them. Wraps an {@link SfxPlayer};
 * feed it playback steps via `advance()` (wire it to the PreviewPlayer's
 * `onAdvance`). Cue times are timeline seconds — the same axis the preview seeks
 * in — so the audio lines up with the motion at any playback speed. Audio stays
 * locked until `resume()` is called from a user gesture (browser autoplay rule).
 */
export class CueScheduler {
  private readonly player: SfxPlayer;
  private cues: SoundCue[] = [];
  private enabled: boolean;

  constructor(opts: { pack?: SoundPack; profile?: SoundProfile; volume?: number; enabled?: boolean } = {}) {
    this.player = new SfxPlayer(opts);
    this.enabled = opts.enabled ?? false;
  }

  setCues(cues: SoundCue[]): void {
    this.cues = [...cues].sort((a, b) => a.time - b.time);
  }
  setEnabled(on: boolean): void {
    this.enabled = on;
  }
  get isEnabled(): boolean {
    return this.enabled;
  }
  setPack(pack: SoundPack): void {
    this.player.setPack(pack);
  }
  /** The template's sonic character — must match the sheet the cues came from. */
  setProfile(profile: SoundProfile): void {
    this.player.setProfile(profile);
  }
  setVolume(v: number): void {
    this.player.setVolume(v);
  }

  /** Unlock audio; call from a user gesture (pressing play, toggling sound on). */
  async resume(): Promise<void> {
    await this.player.resume();
  }

  /** Fire cues crossed by one playback step `(fromT, toT]`, handling a loop wrap. */
  advance(fromT: number, toT: number, wrapped: boolean, duration: number): void {
    if (!this.enabled) return;
    if (wrapped) {
      this.fire(fromT, duration + EPS); // tail of the old lap
      this.fire(-EPS, toT); // head of the new lap
    } else if (toT > fromT) {
      // A fresh start/replay at t=0 sits *on* the opening beat rather than
      // crossing it; include it (like a loop wrap's head) so a cue at exactly 0
      // still fires on the first pass — matching the baked export track.
      this.fire(fromT === 0 ? -EPS : fromT, toT);
    }
  }

  private fire(fromT: number, toT: number): void {
    for (const c of this.cues) {
      if (c.time > fromT && c.time <= toT) this.player.play(c);
    }
  }

  destroy(): void {
    this.player.destroy();
  }
}
