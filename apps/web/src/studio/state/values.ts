import type { Values } from "@jima/engine";
import { isImageValue } from "./persistence";

/**
 * Convert store values into engine-consumable values. Until Phase 4 templates
 * read images, image descriptors are dropped so the engine sees clean JSON.
 */
export function engineValues(values: Values): Values {
  const out: Values = {};
  for (const [k, v] of Object.entries(values)) if (!isImageValue(v)) out[k] = v;
  return out;
}
