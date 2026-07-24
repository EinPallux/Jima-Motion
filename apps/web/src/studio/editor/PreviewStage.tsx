import { useState, type RefObject } from "react";
import type { PreviewApi } from "../hooks/usePreview";
import { useStudio } from "../state/store";
import { PlaybackBar } from "./PlaybackBar";

export function PreviewStage({
  containerRef,
  preview,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  preview: PreviewApi;
}) {
  const aspect = useStudio((s) => s.aspect);
  const [safeZone, setSafeZone] = useState(false);

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-canvas px-4 py-4 sm:px-8 sm:py-6">
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <div
          ref={containerRef}
          className="relative flex max-h-full max-w-full items-center justify-center overflow-hidden rounded-card bg-paper shadow-card"
          style={{ aspectRatio: aspect.replace(":", " / "), width: "min(100%, 720px)" }}
          aria-live="off"
        >
          {!preview.ready && <span className="text-sm text-slate">Preparing preview…</span>}
          {safeZone && aspect === "9:16" && <SafeZoneOverlay />}
        </div>
      </div>

      <div className="mx-auto mt-3 w-full max-w-[720px]">
        <PlaybackBar preview={preview} />
        {aspect === "9:16" && (
          <label className="flex items-center gap-2 px-1 pt-1 text-xs text-slate">
            <input type="checkbox" checked={safeZone} onChange={(e) => setSafeZone(e.target.checked)} className="accent-emerald" />
            Show safe zones (keep text clear of platform UI)
          </label>
        )}
      </div>
    </section>
  );
}

// Approximate Reels/TikTok/Stories safe zone (bottom ~21%, top ~11%).
function SafeZoneOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="absolute inset-x-0 top-0 h-[11.4%] bg-error/10" />
      <div className="absolute inset-x-0 bottom-0 h-[20.8%] bg-error/10" />
      <div className="absolute inset-y-0 left-0 w-[6%] bg-error/5" />
      <div className="absolute inset-y-0 right-0 w-[6%] bg-error/5" />
    </div>
  );
}
