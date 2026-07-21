import type { TemplateDefinition, Values } from "../sdk/types";
import type { Aspect } from "../layout/aspect";
import { TemplateRunner } from "./runner";

export interface PosterConfig {
  aspect: Aspect;
  values?: Values;
  paletteId?: string;
  seed?: number;
  /** Render scale for the thumbnail (default 0.35 of logical size). */
  resolution?: number;
}

const cache = new Map<string, string>();

function key(def: TemplateDefinition, c: PosterConfig): string {
  return [def.id, c.aspect, c.paletteId ?? "", c.resolution ?? 0.35, JSON.stringify(c.values ?? {})].join(
    "|",
  );
}

/**
 * Render a template's poster frame (at `posterTime`) to a PNG data URL for
 * gallery thumbnails. Cached by inputs so repeated cards are cheap. Each call
 * uses a short-lived renderer; fine for the launch-sized library.
 */
export async function renderPosterDataURL(
  def: TemplateDefinition,
  config: PosterConfig,
): Promise<string> {
  const k = key(def, config);
  const hit = cache.get(k);
  if (hit) return hit;

  const runner = await TemplateRunner.create(def, {
    aspect: config.aspect,
    resolution: config.resolution ?? 0.35,
    ...(config.paletteId ? { paletteId: config.paletteId } : {}),
    ...(config.values ? { values: config.values } : {}),
    ...(config.seed !== undefined ? { seed: config.seed } : {}),
  });
  try {
    runner.renderAt(def.posterTime);
    const url = runner.canvas.toDataURL("image/png");
    cache.set(k, url);
    return url;
  } finally {
    runner.destroy();
  }
}

export function clearPosterCache(): void {
  cache.clear();
}
