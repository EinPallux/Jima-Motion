// @jima/templates — the launch template registry.
// Consumers (gallery, Studio routes, poster generation, golden tests) iterate
// this array — adding a template is one entry here plus its folder.

import type { TemplateDefinition } from "@jima/engine";
import { kineticHeadline } from "./kinetic-headline/index";
import { slideReveal } from "./slide-reveal/index";
import { glowPromo } from "./glow-promo/index";
import { productPop } from "./product-pop/index";
import { typewriter } from "./typewriter/index";
import { kenBurns } from "./ken-burns/index";
import { bigNumber } from "./big-number/index";
import { quoteSpotlight } from "./quote-spotlight/index";
import { logoSting } from "./logo-sting/index";
import { saveTheDate } from "./save-the-date/index";
import { tipsStack } from "./tips-stack/index";
import { splitDuo } from "./split-duo/index";

// Ordered for the gallery (roughly by how commonly social managers reach for them).
export const templates: TemplateDefinition[] = [
  kineticHeadline,
  glowPromo,
  bigNumber,
  quoteSpotlight,
  productPop,
  slideReveal,
  typewriter,
  kenBurns,
  saveTheDate,
  tipsStack,
  splitDuo,
  logoSting,
];

export function getTemplate(id: string): TemplateDefinition | undefined {
  return templates.find((t) => t.id === id);
}
