import type { FontRegistry, FontRole } from "@jima/engine";

export interface WordBox {
  text: string;
  /** Center position in logical coordinates. */
  cx: number;
  cy: number;
  width: number;
  height: number;
  line: number;
}

export interface WordLayoutOptions {
  role: FontRole;
  weight: number;
  fontSize: number;
  lineHeight: number;
  maxWidth: number;
  align: "left" | "center";
  /** Left edge (align=left) or center x (align=center) of the block. */
  anchorX: number;
  /** Vertical center of the whole block. */
  centerY: number;
  spaceWidthEm?: number;
}

/**
 * Lay a headline out into word boxes, wrapping to fit maxWidth. Each word gets a
 * center position so it can be animated independently (scale/rotate about its
 * center). Pure given the injected measure — deterministic.
 */
export function layoutWords(
  text: string,
  fonts: FontRegistry,
  opts: WordLayoutOptions,
): WordBox[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const measure = (s: string) =>
    fonts.measure(s, { family: fonts.family(opts.role), weight: opts.weight, size: opts.fontSize });
  const spaceWidth = (opts.spaceWidthEm ?? 0.32) * opts.fontSize;

  // Greedy wrap, tracking per-word widths.
  const lines: { words: { text: string; width: number }[]; width: number }[] = [];
  let current: { text: string; width: number }[] = [];
  let currentWidth = 0;
  for (const word of words) {
    const w = measure(word);
    const add = current.length === 0 ? w : currentWidth + spaceWidth + w;
    if (add <= opts.maxWidth || current.length === 0) {
      current.push({ text: word, width: w });
      currentWidth = add;
    } else {
      lines.push({ words: current, width: currentWidth });
      current = [{ text: word, width: w }];
      currentWidth = w;
    }
  }
  if (current.length) lines.push({ words: current, width: currentWidth });

  const totalHeight = lines.length * opts.lineHeight;
  const top = opts.centerY - totalHeight / 2;

  const boxes: WordBox[] = [];
  lines.forEach((line, li) => {
    const lineY = top + li * opts.lineHeight + opts.lineHeight / 2;
    let cursor = opts.align === "left" ? opts.anchorX : opts.anchorX - line.width / 2;
    for (const word of line.words) {
      boxes.push({
        text: word.text,
        cx: cursor + word.width / 2,
        cy: lineY,
        width: word.width,
        height: opts.fontSize,
        line: li,
      });
      cursor += word.width + spaceWidth;
    }
  });
  return boxes;
}
