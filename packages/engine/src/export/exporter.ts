import { TemplateRunner, type RunnerConfig } from "../runtime/runner";
import { sizeOf } from "../layout/aspect";
import type { TemplateDefinition } from "../sdk/types";
import { detectCapabilities } from "./capabilities";
import { exportVideo } from "./video";
import { exportGif } from "./gif";
import type { ExportFormat, ExportProfile, ExportProgress, ExportResult } from "./types";

export interface ExportRequest {
  def: TemplateDefinition;
  /** Aspect / values / palette / seed for the render. */
  runner: RunnerConfig;
  profile: ExportProfile;
  signal?: AbortSignal;
  onProgress?: (p: ExportProgress) => void;
}

const MIME: Record<ExportFormat, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
  gif: "image/gif",
};

/** Force even dimensions (H.264 requires it; harmless for WebM/GIF). */
function evenize(n: number): number {
  const r = Math.round(n);
  return r % 2 === 0 ? r : r + 1;
}

/**
 * Export a template to a downloadable Blob — entirely client-side. Builds a
 * dedicated runner at the exact output resolution (never reads back the
 * DPR-scaled preview canvas — CLAUDE.md), then dispatches by format. Progress
 * is reported per frame and the whole run is cancelable via `signal`.
 */
export async function exportTemplate(req: ExportRequest): Promise<ExportResult> {
  const { def, profile, signal, onProgress } = req;
  const resolution = profile.resolution ?? 1;
  const logical = sizeOf(req.runner.aspect);
  const width = evenize(logical.width * resolution);
  const height = evenize(logical.height * resolution);

  onProgress?.({ phase: "prepare", frame: 0, totalFrames: 0, ratio: 0 });

  const runner = await TemplateRunner.create(def, { ...req.runner, resolution });
  try {
    const fps = profile.fps;
    const totalFrames = Math.max(1, Math.round(runner.duration * fps));

    let bytes: Uint8Array;
    if (profile.format === "gif") {
      bytes = await exportGif({
        runner,
        fps,
        totalFrames,
        ...(profile.gifMaxColors !== undefined ? { maxColors: profile.gifMaxColors } : {}),
        ...(signal ? { signal } : {}),
        ...(onProgress ? { onProgress } : {}),
      });
    } else {
      const caps = await detectCapabilities({ width, height });
      const codec = profile.format === "mp4" ? caps.mp4Codec : caps.webmCodec;
      if (!codec) {
        throw new Error(
          `This browser can't encode ${profile.format.toUpperCase()} — try GIF, or WebM on Firefox.`,
        );
      }
      bytes = await exportVideo({
        runner,
        format: profile.format,
        codec,
        fps,
        totalFrames,
        ...(signal ? { signal } : {}),
        ...(onProgress ? { onProgress } : {}),
      });
    }

    const blob = new Blob([bytes as BlobPart], { type: MIME[profile.format] });
    return {
      blob,
      bytes,
      format: profile.format,
      width,
      height,
      fps,
      frames: totalFrames,
      filename: `jima-${def.id}-${width}x${height}.${profile.format}`,
    };
  } finally {
    runner.destroy();
  }
}
