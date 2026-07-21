import { useEffect, useState } from "react";
import { renderPosterDataURL, type Aspect, type TemplateDefinition, type Values } from "@jima/engine";

export function PosterThumb({
  def,
  aspect,
  paletteId,
  values,
  className,
  alt,
}: {
  def: TemplateDefinition;
  aspect: Aspect;
  paletteId?: string | undefined;
  values?: Values | undefined;
  className?: string | undefined;
  alt?: string | undefined;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void renderPosterDataURL(def, {
      aspect,
      ...(paletteId ? { paletteId } : {}),
      ...(values ? { values } : {}),
    })
      .then((u) => {
        if (alive) setUrl(u);
      })
      .catch(() => {
        /* poster render failed — leave placeholder */
      });
    return () => {
      alive = false;
    };
  }, [def, aspect, paletteId, values]);

  return (
    <div className={`relative overflow-hidden bg-porcelain ${className ?? ""}`} style={{ aspectRatio: aspect.replace(":", " / ") }}>
      {url ? (
        <img src={url} alt={alt ?? `${def.name} preview`} className="h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 animate-pulse bg-mist/50" aria-hidden />
      )}
    </div>
  );
}
