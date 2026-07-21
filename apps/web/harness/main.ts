// Headless render + export harness for golden-frame and export-smoke tests, and
// for eyeballing templates during development. Driven by URL params:
//   /harness.html?template=kinetic-headline&aspect=9:16&t=1.5&res=0.5&palette=ink-white&v=<json>
//
// Fonts are imported here (as @font-face CSS) so the engine's document.fonts.load
// finds the faces; the runner then guarantees they're ready before first paint.
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";

import {
  TemplateRunner,
  exportTemplate,
  detectCapabilities,
  ExportCancelledError,
  type Aspect,
  type Capabilities,
  type ExportProfile,
  type Values,
} from "@jima/engine";
import { getTemplate } from "@jima/templates";
import { Input, BufferSource, ALL_FORMATS } from "mediabunny";

interface ExportOut {
  base64: string;
  byteLength: number;
  width: number;
  height: number;
  frames: number;
  format: string;
  filename: string;
}
interface ProbeOut {
  width: number;
  height: number;
  packetCount: number;
  duration: number;
}
interface HarnessApi {
  ready: boolean;
  renderAt: (t: number) => void;
  duration: number;
  canvas: HTMLCanvasElement;
  export: (profile: ExportProfile) => Promise<ExportOut>;
  exportExpectCancel: (profile: ExportProfile) => Promise<string>;
  probe: (base64: string) => Promise<ProbeOut | null>;
  caps: () => Promise<Capabilities>;
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

function toBase64(bytes: Uint8Array): string {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

function fromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
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

  const runnerConfig = {
    aspect,
    ...(paletteId ? { paletteId } : {}),
    ...(values ? { values } : {}),
    seed,
  };

  const runner = await TemplateRunner.create(def, { ...runnerConfig, resolution: res });
  const stage = document.getElementById("stage");
  if (!stage) throw new Error("#stage not found");
  runner.canvas.id = "jima-canvas";
  stage.appendChild(runner.canvas);
  runner.renderAt(t);

  window.__jima = {
    ready: true,
    renderAt: (time) => runner.renderAt(time),
    duration: runner.duration,
    canvas: runner.canvas,
    export: async (profile) => {
      const result = await exportTemplate({ def, runner: runnerConfig, profile });
      return {
        base64: toBase64(result.bytes),
        byteLength: result.bytes.byteLength,
        width: result.width,
        height: result.height,
        frames: result.frames,
        format: result.format,
        filename: result.filename,
      };
    },
    exportExpectCancel: async (profile) => {
      const controller = new AbortController();
      controller.abort();
      try {
        await exportTemplate({ def, runner: runnerConfig, profile, signal: controller.signal });
        return "NO_THROW";
      } catch (err) {
        if (err instanceof ExportCancelledError) return "ExportCancelledError";
        return err instanceof Error ? err.name : String(err);
      }
    },
    probe: async (base64) => {
      const bytes = fromBase64(base64);
      const input = new Input({ source: new BufferSource(bytes.buffer as ArrayBuffer), formats: ALL_FORMATS });
      const track = await input.getPrimaryVideoTrack();
      if (!track) return null;
      const stats = await track.computePacketStats();
      const duration = await input.computeDuration();
      return {
        width: track.displayWidth,
        height: track.displayHeight,
        packetCount: stats.packetCount,
        duration,
      };
    },
    caps: () => detectCapabilities(),
  };
  window.__jimaHarnessReady = true;
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  window.__jimaError = message;
  const pre = document.createElement("pre");
  pre.style.color = "#DC2626";
  pre.textContent = `Harness error: ${message}`;
  document.body.appendChild(pre);
  window.__jimaHarnessReady = true;
});

export {};
