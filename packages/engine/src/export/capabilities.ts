import { getFirstEncodableVideoCodec } from "mediabunny";
import type { Capabilities } from "./types";

let cached: Capabilities | null = null;

/**
 * Probe what this browser can actually encode. Uses Mediabunny's real
 * encodability checks (a genuine VideoEncoder.configure under the hood), which
 * is why a Firefox that *claims* H.264 support but can't configure it is
 * correctly reported as mp4:"none" (CLAUDE.md pitfall). GIF is always available
 * (pure JS), so there is never a dead end.
 */
export async function detectCapabilities(
  probe: { width: number; height: number } = { width: 1080, height: 1080 },
): Promise<Capabilities> {
  if (cached) return cached;

  let mp4Codec: string | null = null;
  let webmCodec: string | null = null;

  if (typeof VideoEncoder !== "undefined") {
    try {
      mp4Codec = await getFirstEncodableVideoCodec(["avc"], probe);
    } catch {
      mp4Codec = null;
    }
    try {
      webmCodec = await getFirstEncodableVideoCodec(["vp9", "vp8", "av1"], probe);
    } catch {
      webmCodec = null;
    }
  }

  cached = {
    mp4: mp4Codec ? "native" : "none",
    webm: webmCodec ? "native" : "none",
    gif: "always",
    mp4Codec,
    webmCodec,
  };
  return cached;
}

/** Test hook — clears the memoized probe. */
export function _resetCapabilities(): void {
  cached = null;
}
