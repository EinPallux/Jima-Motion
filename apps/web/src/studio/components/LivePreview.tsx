import { useEffect, useRef } from "react";
import { PreviewPlayer, TemplateRunner, type TemplateDefinition } from "@jima/engine";

/**
 * A small looping live preview of a template at 16:9 — mounted only while a
 * gallery card is hovered/focused, so at most one live WebGL context exists at a
 * time (poster thumbnails are static images; this is the moving preview). Creates
 * its own runner, plays a looping PreviewPlayer, and fully tears down on unmount.
 */
export function LivePreview({ def, paletteId }: { def: TemplateDefinition; paletteId?: string | undefined }) {
  const holder = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    let disposed = false;
    let runner: TemplateRunner | null = null;
    let player: PreviewPlayer | null = null;

    void (async () => {
      // Render at just enough resolution for the card (16:9 logical = 1920×1080).
      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const width = el.clientWidth || 320;
      const resolution = Math.max(0.12, Math.min(0.4, (width * dpr) / 1920));

      const r = await TemplateRunner.create(def, {
        aspect: "16:9",
        resolution,
        ...(paletteId ? { paletteId } : {}),
      });
      if (disposed) {
        r.destroy();
        return;
      }
      runner = r;
      const canvas = r.canvas;
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.setAttribute("aria-hidden", "true");
      el.appendChild(canvas);
      player = new PreviewPlayer(r, { loop: true, autoplay: true });
    })();

    return () => {
      disposed = true;
      player?.destroy();
      if (runner) {
        runner.canvas.remove();
        runner.destroy();
      }
    };
  }, [def, paletteId]);

  return <div ref={holder} className="absolute inset-0 h-full w-full" aria-hidden />;
}
