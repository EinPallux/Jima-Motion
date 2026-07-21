import { useEffect, useRef } from "react";
import { PreviewPlayer, TemplateRunner, sizeOf, type Aspect, type Values } from "@jima/engine";
import { getTemplate } from "@jima/templates";

// A single live engine-rendered template (the site demos its own engine).
// Kept to one instance on the landing to bound WebGL context count; rails and
// galleries use static posters instead.
export function LiveTemplate({
  templateId,
  aspect,
  values,
  paletteId,
  play,
  className,
}: {
  templateId: string;
  aspect: Aspect;
  values?: Values;
  paletteId?: string;
  play: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    let disposed = false;
    let player: PreviewPlayer | null = null;
    let runner: TemplateRunner | null = null;
    let observer: ResizeObserver | null = null;

    void (async () => {
      const def = getTemplate(templateId);
      if (!def) return;
      runner = await TemplateRunner.create(def, {
        aspect,
        ...(paletteId ? { paletteId } : {}),
        ...(values ? { values } : {}),
        resolution: 1,
      });
      if (disposed) {
        runner.destroy();
        return;
      }
      const canvas = runner.canvas;
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", `Animated ${def.name} template preview`);
      container.appendChild(canvas);

      const fit = () => {
        const logical = sizeOf(aspect);
        const scale = Math.min(container.clientWidth / logical.width, container.clientHeight / logical.height) || 0.3;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        runner!.resize(Math.max(0.2, Math.min(2, scale * dpr)));
      };
      fit();
      observer = new ResizeObserver(fit);
      observer.observe(container);

      player = new PreviewPlayer(runner, { loop: true, autoplay: play });
      if (!play) runner.renderAt(def.posterTime);
    })();

    return () => {
      disposed = true;
      observer?.disconnect();
      player?.destroy();
      if (runner) {
        runner.canvas.remove();
        runner.destroy();
      }
    };
  }, [templateId, aspect, paletteId, values, play]);

  return <div ref={ref} className={className} style={{ aspectRatio: aspect.replace(":", " / ") }} />;
}
