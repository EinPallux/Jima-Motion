import { Card, Wordmark } from "../ui";

// Shown when the browser can't run the Studio at all (no WebGL2). Friendly,
// never a broken editor (DESIGN_ARCHITECTURE.md §7.4 / §9.4).
export function CapabilityFloor() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-canvas px-6 py-12">
      <Card bold className="max-w-md px-8 py-10 text-center">
        <Wordmark className="mb-4 text-3xl" />
        <h1 className="mb-3 font-display text-3xl font-extrabold text-ink headline-xl">This browser can’t run the Studio yet</h1>
        <p className="leading-relaxed text-slate">
          Jima Studio needs WebGL2 to render animations on your device. It works great in a current
          version of Chrome, Edge, Firefox or Safari — open this page there and you’re set.
        </p>
      </Card>
    </main>
  );
}

export function hasWebGL2(): boolean {
  if (typeof document === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    // Release the probe context immediately rather than leaving it for GC to
    // reclaim (browsers cap the number of live WebGL contexts).
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return gl != null;
  } catch {
    return false;
  }
}
