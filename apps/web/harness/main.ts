// Headless render harness for golden-frame + export-smoke tests, and for
// eyeballing templates during development. Driven entirely by URL params:
//   /harness.html?template=kinetic-headline&aspect=9:16&t=1.5&res=0.5&palette=ink-white&v=<json>
//
// Fonts are imported here (as @font-face CSS) so the engine's document.fonts.load
// finds the faces; the runner then guarantees they're ready before first paint.
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import { TemplateRunner, type Aspect, type Values } from "@jima/engine";
import { getTemplate } from "@jima/templates";

interface HarnessApi {
  ready: boolean;
  renderAt: (t: number) => void;
  duration: number;
  canvas: HTMLCanvasElement;
}

declare global {
  interface Window {
    __jimaHarnessReady?: boolean;
    __jima?: HarnessApi;
    __jimaError?: string;
  }
}

function param(name: string, fallback = ""): string {
  return new URLSearchParams(location.search).get(name) ?? fallback;
}

async function main(): Promise<void> {
  const templateId = param("template", "kinetic-headline");
  const aspect = (param("aspect", "1:1") as Aspect) || "1:1";
  const t = Number(param("t", "0"));
  const res = Number(param("res", "0.5")) || 0.5;
  const paletteId = param("palette") || undefined;
  const seed = Number(param("seed", "6682")) || 6682;

  let values: Values | undefined;
  const raw = param("v");
  if (raw) {
    try {
      values = JSON.parse(raw) as Values;
    } catch {
      values = undefined;
    }
  }

  const def = getTemplate(templateId);
  if (!def) throw new Error(`Unknown template "${templateId}"`);

  const runner = await TemplateRunner.create(def, {
    aspect,
    resolution: res,
    ...(paletteId ? { paletteId } : {}),
    ...(values ? { values } : {}),
    seed,
  });

  const stage = document.getElementById("stage");
  if (!stage) throw new Error("#stage not found");
  runner.canvas.id = "jima-canvas";
  stage.appendChild(runner.canvas);
  runner.renderAt(t);

  window.__jima = {
    ready: true,
    renderAt: (time: number) => runner.renderAt(time),
    duration: runner.duration,
    canvas: runner.canvas,
  };
  window.__jimaHarnessReady = true;
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  window.__jimaError = message;
  // Surface it visibly for local debugging.
  const pre = document.createElement("pre");
  pre.style.color = "#DC2626";
  pre.textContent = `Harness error: ${message}`;
  document.body.appendChild(pre);
  // Still flip ready so waits don't hang forever; tests assert __jimaError.
  window.__jimaHarnessReady = true;
});

export {};
