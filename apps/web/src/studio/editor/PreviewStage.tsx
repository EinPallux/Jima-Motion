import { useState, type CSSProperties, type RefObject } from "react";
import type { PreviewApi } from "../hooks/usePreview";
import { useStudio } from "../state/store";
import { PlaybackBar } from "./PlaybackBar";

// Subtle dotted "stage" backdrop — reads as a pro canvas without a dark theme.
const STAGE_BG: CSSProperties = {
  backgroundImage: "radial-gradient(circle, rgba(10,10,13,0.05) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
  backgroundPosition: "center",
};

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
    <section className="relative flex min-h-0 flex-1 flex-col bg-canvas px-4 py-4 sm:px-8 sm:py-6" style={STAGE_BG}>
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <div
          ref={containerRef}
          className="relative flex max-h-full max-w-full items-center justify-center overflow-hidden rounded-bento bg-paper shadow-pop ring-1 ring-ink/10"
          style={{ aspectRatio: aspect.replace(":", " / "), width: "min(100%, 720px)" }}
          aria-live="off"
        >
          {!preview.ready && <span className="text-sm text-slate">Preparing preview…</span>}
          {safeZone && aspect === "9:16" && <SafeZoneOverlay />}
        </div>
      </div>

      <div className="mx-auto mt-4 w-full max-w-[720px]">
        <div className="rounded-2xl border border-mist bg-paper/95 px-2 shadow-card backdrop-blur">
          <PlaybackBar preview={preview} />
        </div>
        {aspect === "9:16" && (
          <label className="mt-2 flex items-center justify-center gap-2 text-xs text-slate">
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
