// Sound layer public surface. Cues are derived from a timeline's motion beats;
// the SFX synth turns them into procedural Web Audio (live for preview, offline
// for export). Sound never affects the visual render or golden frames.
export * from "./cues";
export * from "./sfx";
export * from "./scheduler";
