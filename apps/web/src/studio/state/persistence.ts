import type { Aspect, Values } from "@jima/engine";
import { getBlob, putBlob, clearBlobs, idbAvailable } from "./idb";

// A user image lives as this descriptor in the store; the Blob itself is in
// IndexedDB under `key`. `url` is an object URL for preview (not persisted).
export interface ImageValue {
  __img: true;
  key: string;
  name: string;
  url: string;
}

export function isImageValue(v: unknown): v is ImageValue {
  return typeof v === "object" && v !== null && (v as { __img?: unknown }).__img === true;
}

export interface PersistedProject {
  v: 1;
  templateId: string;
  aspect: Aspect;
  paletteId?: string;
  font?: string;
  values: Values;
  speed: number;
  loop: boolean;
  updatedAt: number;
}

const KEY = "jima.v1.project";

export function storageAvailable(): boolean {
  try {
    const k = "__jima_probe__";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

/** Persist project state (strips image object URLs; blobs live in IndexedDB). */
export function saveProject(p: Omit<PersistedProject, "v" | "updatedAt">): void {
  if (!storageAvailable()) return;
  const values: Values = {};
  for (const [k, val] of Object.entries(p.values)) {
    values[k] = isImageValue(val) ? { __img: true, key: val.key, name: val.name } : val;
  }
  const record: PersistedProject = { v: 1, ...p, values, updatedAt: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    /* quota / private mode — silently skip (Studio still works statelessly) */
  }
}

/** Read persisted project metadata (image values still lack their object URLs). */
export function loadProject(): PersistedProject | null {
  if (!storageAvailable()) return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PersistedProject;
    return parsed.v === 1 ? parsed : null;
  } catch {
    return null;
  }
}

/** Rehydrate image object URLs from IndexedDB blobs for the given values. */
export async function resolveImageValues(values: Values): Promise<Values> {
  if (!idbAvailable()) return values;
  const out: Values = { ...values };
  for (const [k, val] of Object.entries(values)) {
    if (val && typeof val === "object" && (val as { __img?: unknown }).__img === true) {
      const ref = val as { key: string; name: string };
      const blob = await getBlob(ref.key);
      if (blob) {
        out[k] = { __img: true, key: ref.key, name: ref.name, url: URL.createObjectURL(blob) };
      } else {
        delete out[k];
      }
    }
  }
  return out;
}

export async function storeImageBlob(key: string, blob: Blob): Promise<void> {
  if (idbAvailable()) await putBlob(key, blob);
}

export function clearProject(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  if (idbAvailable()) void clearBlobs();
}
