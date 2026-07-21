import type { Values } from "@jima/engine";

/**
 * Values passed to the engine. Image descriptors carry a `url` the engine loads
 * into a texture (TemplateContext.images), so we pass values through unchanged.
 * Kept as a seam in case future normalization is needed.
 */
export function engineValues(values: Values): Values {
  return values;
}
