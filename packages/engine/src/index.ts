// @jima/engine — deterministic render + export engine.
// Phase 1 fills in the timeline, runtime, layout, text and preview modules;
// Phase 2 adds the export pipeline. This barrel grows as those land.

export const ENGINE_VERSION = "0.1.0";

export * from "./timeline/index";
