// @jima/templates — the launch template registry.
// Phase 1 lands T01 (kinetic-headline); Phase 4 completes the set of 12.
// Consumers (gallery, Studio routes, poster generation, golden tests) iterate
// this array — adding a template is one entry here plus its folder.

import type { TemplateDefinition } from "@jima/engine";
import { kineticHeadline } from "./kinetic-headline/index";

export const templates: TemplateDefinition[] = [kineticHeadline];

export function getTemplate(id: string): TemplateDefinition | undefined {
  return templates.find((t) => t.id === id);
}

export { kineticHeadline };
