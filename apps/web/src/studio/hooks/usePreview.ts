import { useEffect, useRef, useState, type RefObject } from "react";
import {
  PreviewPlayer,
  TemplateRunner,
  sizeOf,
  type Aspect,
  type TemplateDefinition,
  type Values,
} from "@jima/engine";
import { engineValues } from "../state/values";

export interface PreviewApi {
  currentTime: number;
  duration: number;
  playing: boolean;
  ready: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (t: number) => void;
  restart: () => void;
  stepFrame: (dir: 1 | -1, big?: boolean) => void;
}

interface Params {
  def: TemplateDefinition | null;
  aspect: Aspect;
  values: Values;
  paletteId: string | undefined;
  speed: number;
  loop: boolean;
  reducedMotion: boolean;
}

function fit(container: HTMLElement, aspect: Aspect) {
  const logical = sizeOf(aspect);
  const availW = container.clientWidth;
  const availH = container.clientHeight;
  const scale = Math.min(availW / logical.width, availH / logical.height) || 0.1;
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  return {
    cssW: Math.round(logical.width * scale),
    cssH: Math.round(logical.height * scale),
    resolution: Math.max(0.1, Math.min(2, scale * dpr)),
  };
}

export function usePreview(containerRef: RefObject<HTMLElement | null>, params: Params): PreviewApi {
  const runnerRef = useRef<TemplateRunner | null>(null);
  const playerRef = useRef<PreviewPlayer | null>(null);
  const [state, setState] = useState({ t: 0, duration: 0, playing: false, ready: false });

  // Create runner + player when the template or aspect changes.
  useEffect(() => {
    const container = containerRef.current;
    if (!params.def || !container) return;
    let disposed = false;
    let observer: ResizeObserver | null = null;

    void (async () => {
      const runner = await TemplateRunner.create(params.def!, {
        aspect: params.aspect,
        values: engineValues(params.values),
        ...(params.paletteId ? { paletteId: params.paletteId } : {}),
        resolution: 1,
      });
      if (disposed) {
        runner.destroy();
        return;
      }
      runnerRef.current = runner;

      const canvas = runner.canvas;
      canvas.style.display = "block";
      canvas.style.maxWidth = "100%";
      canvas.style.maxHeight = "100%";
      canvas.setAttribute("role", "img");
      container.appendChild(canvas);

      const applyFit = () => {
        const { cssW, cssH, resolution } = fit(container, params.aspect);
        canvas.style.width = `${cssW}px`;
        canvas.style.height = `${cssH}px`;
        runner.resize(resolution);
      };
      applyFit();

      const player = new PreviewPlayer(runner, {
        loop: params.loop,
        speed: params.speed,
        autoplay: !params.reducedMotion,
        onFrame: (t, duration) => setState((s) => ({ ...s, t, duration, playing: player.isPlaying })),
      });
      playerRef.current = player;
      setState({ t: 0, duration: runner.duration, playing: player.isPlaying, ready: true });

      observer = new ResizeObserver(applyFit);
      observer.observe(container);
    })();

    return () => {
      disposed = true;
      observer?.disconnect();
      playerRef.current?.destroy();
      playerRef.current = null;
      const r = runnerRef.current;
      if (r) {
        r.canvas.remove();
        r.destroy();
        runnerRef.current = null;
      }
      setState({ t: 0, duration: 0, playing: false, ready: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.def, params.aspect]);

  // Rebuild scene on value/palette changes (debounced, in place).
  useEffect(() => {
    const runner = runnerRef.current;
    const player = playerRef.current;
    if (!runner) return;
    const id = setTimeout(() => {
      runner.rebuildScene(engineValues(params.values), params.paletteId);
      setState((s) => ({ ...s, duration: runner.duration }));
      if (player && !player.isPlaying) runner.renderAt(player.currentTime);
    }, 60);
    return () => clearTimeout(id);
     
  }, [params.values, params.paletteId]);

  useEffect(() => {
    playerRef.current?.setSpeed(params.speed);
  }, [params.speed]);

  useEffect(() => {
    playerRef.current?.setLoop(params.loop);
  }, [params.loop]);

  const player = () => playerRef.current;
  return {
    currentTime: state.t,
    duration: state.duration,
    playing: state.playing,
    ready: state.ready,
    play: () => {
      player()?.play();
      setState((s) => ({ ...s, playing: true }));
    },
    pause: () => {
      player()?.pause();
      setState((s) => ({ ...s, playing: false }));
    },
    toggle: () => {
      const p = player();
      if (!p) return;
      p.toggle();
      setState((s) => ({ ...s, playing: p.isPlaying }));
    },
    seek: (t) => {
      player()?.seek(t);
      setState((s) => ({ ...s, t }));
    },
    restart: () => {
      player()?.seek(0);
      setState((s) => ({ ...s, t: 0 }));
    },
    stepFrame: (dir, big) => {
      const p = player();
      if (!p) return;
      p.pause();
      const delta = (big ? 1 : 1 / 30) * dir;
      const nt = Math.max(0, Math.min(p.duration, p.currentTime + delta));
      p.seek(nt);
      setState((s) => ({ ...s, t: nt, playing: false }));
    },
  };
}
