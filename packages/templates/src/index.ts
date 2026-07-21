// @jima/templates — the launch template registry.
// Consumers (gallery, Studio routes, poster generation, golden tests) iterate
// this array — adding a template is one entry here plus its folder.

import type { TemplateDefinition } from "@jima/engine";
import { kineticHeadline } from "./kinetic-headline/index";
import { glowPromo } from "./glow-promo/index";
import { bigNumber } from "./big-number/index";
import { quoteSpotlight } from "./quote-spotlight/index";

export const templates: TemplateDefinition[] = [kineticHeadline, glowPromo, bigNumber, quoteSpotlight];

export function getTemplate(id: string): TemplateDefinition | undefined {
  return templates.find((t) => t.id === id);
}

export { kineticHeadline, glowPromo, bigNumber, quoteSpotlight };
