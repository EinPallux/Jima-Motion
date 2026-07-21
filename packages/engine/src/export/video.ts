import {
  Output,
  BufferTarget,
  Mp4OutputFormat,
  WebMOutputFormat,
  CanvasSource,
  QUALITY_HIGH,
  type VideoCodec,
} from "mediabunny";
import type { TemplateRunner } from "../runtime/runner";
import { ExportCancelledError, type ExportFormat, type ExportProgress } from "./types";

export interface VideoExportArgs {
  runner: TemplateRunner;
  format: Extract<ExportFormat, "mp4" | "webm">;
  codec: string;
  fps: number;
  totalFrames: number;
  signal?: AbortSignal;
  onProgress?: (p: ExportProgress) => void;
}

/**
 * Deterministic frame loop → WebCodecs (via Mediabunny CanvasSource) → MP4/WebM.
 * Renders each frame at t = i/fps, hands the canvas to Mediabunny, and awaits
 * `source.add` so encoder/writer backpressure is respected (no OOM on long
 * exports — CLAUDE.md). Never uses captureStream; frame count is exact.
 */
export async function exportVideo(args: VideoExportArgs): Promise<Uint8Array> {
  const { runner, format, codec, fps, totalFrames, signal, onProgress } = args;

  const output = new Output({
    format: format === "mp4" ? new Mp4OutputFormat() : new WebMOutputFormat(),
    target: new BufferTarget(),
  });
  const source = new CanvasSource(runner.canvas, {
    codec: codec as VideoCodec, // validated by capability detection
    bitrate: QUALITY_HIGH,
    keyFrameInterval: 2,
  });
  output.addVideoTrack(source, { frameRate: fps });
  await output.start();

  const frameDur = 1 / fps;
  try {
    for (let i = 0; i < totalFrames; i++) {
      if (signal?.aborted) {
        await output.cancel();
        throw new ExportCancelledError();
      }
      runner.renderAt(i * frameDur);
      await source.add(i * frameDur, frameDur);
      onProgress?.({
        phase: "render",
        frame: i + 1,
        totalFrames,
        ratio: ((i + 1) / totalFrames) * 0.97,
      });
    }
    onProgress?.({ phase: "finalize", frame: totalFrames, totalFrames, ratio: 0.99 });
    await output.finalize();
  } catch (err) {
    if (!(err instanceof ExportCancelledError)) {
      try {
        await output.cancel();
      } catch {
        /* already failed */
      }
    }
    throw err;
  }

  const buffer = output.target.buffer;
  if (!buffer) throw new Error("exportVideo: no output buffer produced");
  return new Uint8Array(buffer);
}
