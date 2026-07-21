import type { EaseFn } from "./easings";
import { linear } from "./easings";

// A single animated numeric property over a time window (seconds).
export interface Tween {
  target: object;
  /** Dot path on the target, e.g. "x", "alpha", "scale.x", "rotation". */
  prop: string;
  from: number;
  to: number;
  start: number;
  duration: number;
  ease: EaseFn;
}

// A discrete (possibly non-numeric) assignment applied once t passes `at`.
// Used for text swaps, visibility toggles, tint changes, etc.
export interface SetEvent {
  target: object;
  prop: string;
  value: unknown;
  at: number;
}

export interface TweenSpec {
  prop: string;
  from: number;
  to: number;
  start: number;
  duration: number;
  ease?: EaseFn;
}

export interface StaggerOptions {
  /** Seconds between successive items. */
  each: number;
  /** Start time of the first item (seconds). Default 0. */
  start?: number;
}

type MutableTarget = Record<string, unknown>;

function setPath(target: object, path: string, value: unknown): void {
  const dot = path.indexOf(".");
  if (dot === -1) {
    (target as MutableTarget)[path] = value;
    return;
  }
  const head = path.slice(0, dot);
  const next = (target as MutableTarget)[head];
  if (next && typeof next === "object") {
    setPath(next, path.slice(dot + 1), value);
  }
}

const clamp01 = (u: number): number => (u < 0 ? 0 : u > 1 ? 1 : u);

/**
 * Deterministic timeline. `evaluate(t)` writes every animated property to a
 * defined value derived only from t — it never accumulates state across calls,
 * so seeking is exact and golden frames are stable (TECHNICAL_ARCHITECTURE.md §6).
 *
 * When several tweens drive the same (target, prop), the one whose `start` is the
 * latest at-or-before t wins; before any starts, the earliest tween's `from`
 * holds; after a tween ends, its `to` holds. This makes sequenced animations on
 * one property behave predictably.
 */
export class JimaTimeline {
  private tweens: Tween[] = [];
  private sets: SetEvent[] = [];
  private setsSorted = true;
  private groups: Map<object, Map<string, Tween[]>> | null = null;

  add(tween: Tween): this {
    this.tweens.push(tween);
    this.groups = null;
    return this;
  }

  /** Convenience: author a tween against a target. */
  to(target: object, spec: TweenSpec): this {
    return this.add({
      target,
      prop: spec.prop,
      from: spec.from,
      to: spec.to,
      start: spec.start,
      duration: spec.duration,
      ease: spec.ease ?? linear,
    });
  }

  /** Discrete assignment applied once t ≥ at (last one wins). */
  set(target: object, prop: string, value: unknown, at = 0): this {
    this.sets.push({ target, prop, value, at });
    this.setsSorted = false;
    return this;
  }

  /** Apply one tween spec across many targets, offset by `each` seconds. */
  stagger(targets: readonly object[], spec: TweenSpec, opts: StaggerOptions): this {
    const start0 = opts.start ?? spec.start ?? 0;
    targets.forEach((target, i) => {
      this.add({
        target,
        prop: spec.prop,
        from: spec.from,
        to: spec.to,
        start: start0 + i * opts.each,
        duration: spec.duration,
        ease: spec.ease ?? linear,
      });
    });
    return this;
  }

  /** Total timeline length in seconds (latest tween end or set time). */
  get duration(): number {
    let end = 0;
    for (const tw of this.tweens) end = Math.max(end, tw.start + tw.duration);
    for (const s of this.sets) end = Math.max(end, s.at);
    return end;
  }

  private ensureGroups(): Map<object, Map<string, Tween[]>> {
    if (this.groups) return this.groups;
    const groups = new Map<object, Map<string, Tween[]>>();
    for (const tw of this.tweens) {
      let byProp = groups.get(tw.target);
      if (!byProp) {
        byProp = new Map<string, Tween[]>();
        groups.set(tw.target, byProp);
      }
      const arr = byProp.get(tw.prop);
      if (arr) arr.push(tw);
      else byProp.set(tw.prop, [tw]);
    }
    for (const byProp of groups.values()) {
      for (const arr of byProp.values()) arr.sort((a, b) => a.start - b.start);
    }
    this.groups = groups;
    return groups;
  }

  private static resolve(group: Tween[], t: number): number {
    let active: Tween | null = null;
    for (const tw of group) {
      if (tw.start <= t) active = tw;
      else break;
    }
    if (!active) {
      // Before anything starts, hold the earliest tween's `from`.
      return group[0]!.from;
    }
    const local =
      active.duration <= 0 ? (t >= active.start ? 1 : 0) : (t - active.start) / active.duration;
    const eased = active.ease(clamp01(local));
    return active.from + (active.to - active.from) * eased;
  }

  /** Write all animated + set properties for time `t` (seconds) onto the targets. */
  evaluate(t: number): void {
    // Discrete sets first (in `at` order so the latest applicable wins), so
    // tweens (e.g. an alpha fade) can layer on top.
    if (!this.setsSorted) {
      this.sets.sort((a, b) => a.at - b.at);
      this.setsSorted = true;
    }
    for (const s of this.sets) {
      if (s.at <= t) setPath(s.target, s.prop, s.value);
    }
    const groups = this.ensureGroups();
    for (const [target, byProp] of groups) {
      for (const [prop, group] of byProp) {
        setPath(target, prop, JimaTimeline.resolve(group, t));
      }
    }
  }
}
