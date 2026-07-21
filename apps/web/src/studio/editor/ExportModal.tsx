import { useEffect, useRef, useState } from "react";
import {
  exportTemplate,
  type Capabilities,
  type ExportFormat,
  type ExportProfile,
  type ExportProgress,
  type ExportResult,
  type TemplateDefinition,
} from "@jima/engine";
import { useStudio } from "../state/store";
import { engineValues } from "../state/values";

type Phase = "configure" | "rendering" | "done" | "error";

const RES = { "1080": 1, "720": 720 / 1080, "480": 480 / 1080 } as const;

export function ExportModal({
  def,
  caps,
  onClose,
}: {
  def: TemplateDefinition;
  caps: Capabilities | null;
  onClose: () => void;
}) {
  const aspect = useStudio((s) => s.aspect);
  const values = useStudio((s) => s.values);
  const paletteId = useStudio((s) => s.paletteId);

  const [phase, setPhase] = useState<Phase>("configure");
  const [format, setFormat] = useState<ExportFormat>("webm");
  const [videoQuality, setVideoQuality] = useState<"1080" | "720">("1080");
  const [fps, setFps] = useState(30);
  const [gifSize, setGifSize] = useState<"480" | "720">("480");
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [result, setResult] = useState<ExportResult | null>(null);
  const [error, setError] = useState<string>("");
  const abortRef = useRef<AbortController | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  // Default to the best available format once caps are known.
  useEffect(() => {
    if (!caps) return;
    setFormat(caps.mp4 === "native" ? "mp4" : "webm");
  }, [caps]);

  useEffect(() => {
    return () => {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const available: Record<ExportFormat, boolean> = {
    mp4: caps ? caps.mp4 === "native" : false,
    webm: caps ? caps.webm === "native" : true,
    gif: true,
  };

  async function run() {
    const controller = new AbortController();
    abortRef.current = controller;
    setPhase("rendering");
    setProgress(null);
    const profile: ExportProfile =
      format === "gif"
        ? { format: "gif", fps: 12, resolution: RES[gifSize], gifMaxColors: 128 }
        : { format, fps, resolution: RES[videoQuality] };
    try {
      const res = await exportTemplate({
        def,
        runner: { aspect, values: engineValues(values), ...(paletteId ? { paletteId } : {}) },
        profile,
        signal: controller.signal,
        onProgress: setProgress,
      });
      const url = URL.createObjectURL(res.blob);
      resultUrlRef.current = url;
      setResult(res);
      setPhase("done");
      triggerDownload(url, res.filename);
    } catch (err) {
      if (err instanceof Error && err.name === "ExportCancelledError") {
        setPhase("configure");
        return;
      }
      setError(err instanceof Error ? err.message : String(err));
      setPhase("error");
    } finally {
      abortRef.current = null;
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Export"
      onClick={(e) => {
        if (e.target === e.currentTarget && phase !== "rendering") onClose();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-[28px] bg-paper shadow-[var(--shadow-pop)]">
        <div className="flex items-center justify-between border-b border-mist px-6 py-4">
          <h2 className="font-display text-xl font-bold text-ink">Export</h2>
          {phase !== "rendering" && (
            <button type="button" onClick={onClose} aria-label="Close" className="rounded-full px-2 py-1 text-slate hover:bg-mist">
              ✕
            </button>
          )}
        </div>

        <div className="px-6 py-5">
          {phase === "configure" && (
            <Configure
              format={format}
              setFormat={setFormat}
              available={available}
              caps={caps}
              videoQuality={videoQuality}
              setVideoQuality={setVideoQuality}
              fps={fps}
              setFps={setFps}
              gifSize={gifSize}
              setGifSize={setGifSize}
              aspect={aspect}
              onExport={run}
            />
          )}
          {phase === "rendering" && <Rendering progress={progress} onCancel={() => abortRef.current?.abort()} />}
          {phase === "done" && result && (
            <Done result={result} url={resultUrlRef.current} onAnother={() => setPhase("configure")} onClose={onClose} />
          )}
          {phase === "error" && (
            <ErrorState message={error} onRetry={() => setPhase("configure")} onGif={() => { setFormat("gif"); setPhase("configure"); }} />
          )}
        </div>
      </div>
    </div>
  );
}

const FORMAT_META: Record<ExportFormat, { title: string; sub: string }> = {
  mp4: { title: "MP4", sub: "Best for Instagram & TikTok" },
  webm: { title: "WebM", sub: "Smallest video, plays everywhere modern" },
  gif: { title: "GIF", sub: "Loops anywhere · ≤ 10s" },
};

function Configure(props: {
  format: ExportFormat;
  setFormat: (f: ExportFormat) => void;
  available: Record<ExportFormat, boolean>;
  caps: Capabilities | null;
  videoQuality: "1080" | "720";
  setVideoQuality: (q: "1080" | "720") => void;
  fps: number;
  setFps: (n: number) => void;
  gifSize: "480" | "720";
  setGifSize: (s: "480" | "720") => void;
  aspect: string;
  onExport: () => void;
}) {
  const { format, setFormat, available, caps } = props;
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-2">
        {(["mp4", "webm", "gif"] as ExportFormat[]).map((f) => {
          const enabled = available[f];
          const active = format === f;
          return (
            <button
              key={f}
              type="button"
              disabled={!enabled}
              onClick={() => setFormat(f)}
              aria-pressed={active}
              className={`flex flex-col gap-1 rounded-[14px] border p-3 text-left transition-colors ${active ? "border-ember-text bg-ember-tint" : "border-mist hover:border-slate"} ${!enabled ? "cursor-not-allowed opacity-45" : ""}`}
            >
              <span className="font-display text-base font-bold text-ink">{FORMAT_META[f].title}</span>
              <span className="text-xs leading-snug text-slate">
                {enabled ? FORMAT_META[f].sub : f === "mp4" ? "Not available in this browser — use WebM or GIF" : "Unavailable"}
              </span>
            </button>
          );
        })}
      </div>

      {format === "gif" ? (
        <Segment label="Size" value={props.gifSize} options={[["480", "480p"], ["720", "720p"]]} onChange={(v) => props.setGifSize(v as "480" | "720")} />
      ) : (
        <>
          <Segment label="Resolution" value={props.videoQuality} options={[["1080", "1080p"], ["720", "720p"]]} onChange={(v) => props.setVideoQuality(v as "1080" | "720")} />
          <Segment label="Frame rate" value={String(props.fps)} options={[["30", "30 fps"], ["60", "60 fps"]]} onChange={(v) => props.setFps(Number(v))} />
        </>
      )}

      <p className="text-xs text-slate">
        {props.aspect} · everything renders on your device — nothing is uploaded.
        {caps === null ? " Checking formats…" : ""}
      </p>

      <button
        type="button"
        onClick={props.onExport}
        className="w-full rounded-[14px] bg-ember py-3 text-base font-semibold text-ink shadow-[var(--shadow-pop)] transition-transform hover:scale-[1.02] active:scale-100"
      >
        Export {FORMAT_META[format].title}
      </button>
    </div>
  );
}

function Segment({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-ink">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex gap-1 rounded-[12px] bg-porcelain p-1">
        {options.map(([val, lbl]) => {
          const active = val === value;
          return (
            <button
              key={val}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(val)}
              className={`rounded-[9px] px-3 py-1 text-sm font-medium transition-colors ${active ? "bg-paper text-ink shadow-[0_1px_3px_rgba(16,16,20,0.1)]" : "text-slate hover:text-ink"}`}
            >
              {lbl}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Rendering({ progress, onCancel }: { progress: ExportProgress | null; onCancel: () => void }) {
  const ratio = progress?.ratio ?? 0;
  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-ink">Rendering…</span>
        <span aria-live="polite" className="tabular-nums text-slate">
          {progress ? `${progress.frame} / ${progress.totalFrames} frames` : "starting…"}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-mist">
        <div className="h-full rounded-full bg-ember transition-[width] duration-150" style={{ width: `${Math.round(ratio * 100)}%` }} />
      </div>
      <button type="button" onClick={onCancel} className="self-start rounded-[10px] px-3 py-1.5 text-sm font-medium text-slate hover:bg-mist hover:text-ink">
        Cancel
      </button>
    </div>
  );
}

function Done({ result, url, onAnother, onClose }: { result: ExportResult; url: string | null; onAnother: () => void; onClose: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center overflow-hidden rounded-[16px] bg-porcelain p-3">
        {url && (result.format === "gif" ? (
          <img src={url} alt="Export preview" className="max-h-64 rounded-[8px]" />
        ) : (
          <video src={url} className="max-h-64 rounded-[8px]" autoPlay loop muted playsInline />
        ))}
      </div>
      <p className="text-sm text-slate">
        Saved <span className="font-medium text-ink">{result.filename}</span> — {result.width}×{result.height}, {result.frames} frames.
      </p>
      <div className="flex flex-wrap gap-2">
        {url && (
          <a
            href={url}
            download={result.filename}
            className="rounded-[12px] bg-ember px-4 py-2.5 text-sm font-semibold text-ink shadow-[var(--shadow-pop)] transition-transform hover:scale-[1.02]"
          >
            Download again
          </a>
        )}
        <button type="button" onClick={onAnother} className="rounded-[12px] border border-mist px-4 py-2.5 text-sm font-medium text-ink hover:bg-mist">
          Export another
        </button>
        <button type="button" onClick={onClose} className="ml-auto rounded-[12px] px-4 py-2.5 text-sm font-medium text-slate hover:bg-mist">
          Done
        </button>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry, onGif }: { message: string; onRetry: () => void; onGif: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink">That export hit a snag on this device. Your work is safe.</p>
      <p className="rounded-[12px] bg-porcelain px-3 py-2 text-xs text-slate">{message}</p>
      <div className="flex gap-2">
        <button type="button" onClick={onGif} className="rounded-[12px] bg-ember px-4 py-2.5 text-sm font-semibold text-ink">
          Try GIF instead
        </button>
        <button type="button" onClick={onRetry} className="rounded-[12px] border border-mist px-4 py-2.5 text-sm font-medium text-ink hover:bg-mist">
          Back
        </button>
      </div>
    </div>
  );
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
