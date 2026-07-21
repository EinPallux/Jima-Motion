import { describe, it, expect } from "vitest";
import { JimaTimeline } from "../timeline/timeline";
import { linear, spring, outBack } from "../timeline/easings";
import { cuesFromBeats, cuesFromTimeline } from "./cues";
import type { TimelineBeat } from "../timeline/timeline";

function beat(partial: Partial<TimelineBeat> & { time: number }): TimelineBeat {
  return {
    overshoot: false,
    scaleFromSmall: false,
    moveDist: 0,
    rotate: false,
    fadeIn: false,
    count: 1,
    ...partial,
  };
}

describe("cues", () => {
  it("maps motion beats to fitting sounds", () => {
    const cues = cuesFromBeats(
      [
        beat({ time: 0.0, overshoot: true, scaleFromSmall: true }), // springy entrance → pop
        beat({ time: 0.5, moveDist: 400 }), // big slide → swoosh
        beat({ time: 1.0, fadeIn: true }), // gentle fade → tick
      ],
      3,
    );
    const byTime = (t: number) => cues.find((c) => Math.abs(c.time - t) < 1e-6);
    expect(byTime(0.0)?.sound).toBe("pop");
    expect(byTime(0.5)?.sound).toBe("swoosh");
    expect(byTime(1.0)?.sound).toBe("tick");
  });

  it("always ends on a resolve ding near the end", () => {
    const cues = cuesFromBeats([beat({ time: 0, moveDist: 200 })], 2);
    const ding = cues.find((c) => c.sound === "ding");
    expect(ding).toBeDefined();
    expect(ding!.time).toBeCloseTo(1.45, 6); // duration - 0.55
  });

  it("thins near-simultaneous cues", () => {
    const cues = cuesFromBeats(
      [
        beat({ time: 0.5, moveDist: 200 }),
        beat({ time: 0.51, moveDist: 200 }), // within 45ms → dropped
        beat({ time: 0.52, moveDist: 200 }), // within 45ms → dropped
      ],
      2,
    );
    // Only one of the clustered slides survives (+ the ding).
    const slides = cues.filter((c) => c.sound === "swoosh");
    expect(slides).toHaveLength(1);
  });

  it("caps the number of cues but keeps the ding", () => {
    const many = Array.from({ length: 60 }, (_, i) => beat({ time: i * 0.2, moveDist: 200 }));
    const cues = cuesFromBeats(many, 20);
    expect(cues.length).toBeLessThanOrEqual(28);
    expect(cues.some((c) => c.sound === "ding")).toBe(true);
  });

  it("is deterministic and derivable straight from a timeline", () => {
    const build = () => {
      const n = { x: 0, alpha: 1, scale: { x: 1, y: 1 }, rotation: 0 };
      return new JimaTimeline()
        .to(n, { prop: "scale.x", from: 0.1, to: 1, start: 0, duration: 0.5, ease: spring() })
        .to(n, { prop: "x", from: 0, to: 300, start: 0.8, duration: 0.5, ease: linear })
        .to(n, { prop: "rotation", from: -0.5, to: 0, start: 1.6, duration: 0.4, ease: outBack });
    };
    const a = cuesFromTimeline(build(), build().duration);
    const b = cuesFromTimeline(build(), build().duration);
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(0);
  });
});
