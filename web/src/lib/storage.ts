// Device-only storage (docs/05-Backend-Schema.md §1): the adaptation profile and the
// progress never leave the browser. Every access is wrapped: storage can be blocked.
import type { Lang } from "./catalog";

export type FontSize = "s" | "m" | "l" | "xl" | "xxl" | "xxxl";
/** How each step is illustrated: ARASAAC pictograms, generated realistic images, or text only. */
export type ImageMode = "picto" | "real" | "none";
export type Need = "tea" | "tdah" | "dislexia" | "discalculia" | "disgrafia" | "vision" | "otras";
export const NEEDS: Need[] = ["tea", "tdah", "dislexia", "discalculia", "disgrafia", "vision", "otras"];

export interface Prefs {
  lang: Lang;
  fontSize: FontSize;
  needs: Need[];
  reducedMotion: boolean;
  calmColors: boolean;
  highContrast: boolean;
  readAloud: boolean;
  dyslexiaFont: boolean;
  imageMode: ImageMode;
  dictation: boolean;
  onboarded: boolean;
}

export const DEFAULT_PREFS: Prefs = {
  lang: "es",
  fontSize: "m",
  imageMode: "picto",
  dictation: true,
  needs: [],
  reducedMotion: false,
  calmColors: false,
  highContrast: false,
  readAloud: false,
  dyslexiaFont: false,
  onboarded: false,
};

export interface StoredCase {
  id: string;
  secret: string;
  procedureId: string;
  courtId: string;
  source: "search" | "citation";
  createdAt: string;
}

export interface Progress {
  current: number;
  done: string[];
  skipped: string[];
  /** Documents the person ticked as ready. */
  checked?: string[];
  updatedAt: string;
}

export const PREFS_KEY = "bj.prefs";
const CASES_KEY = "bj.cases";
const progressKey = (caseId: string) => `bj.progress.${caseId}`;
const seenDocsKey = (caseId: string) => `bj.seenDocs.${caseId}`;

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked or full: the app keeps working for this visit.
  }
}

export function loadPrefs(): Prefs {
  return { ...DEFAULT_PREFS, ...(read<Partial<Prefs>>(PREFS_KEY) ?? {}) };
}

// Prefs as an external store for useSyncExternalStore: the snapshot is cached by its raw
// JSON so React gets the same object until something actually changes.
const prefListeners = new Set<() => void>();
let prefCache: { raw: string | null; value: Prefs } | null = null;

export function subscribePrefs(listener: () => void): () => void {
  prefListeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === PREFS_KEY || e.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    prefListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getPrefsSnapshot(): Prefs {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(PREFS_KEY);
  } catch {}
  if (!prefCache || prefCache.raw !== raw) prefCache = { raw, value: loadPrefs() };
  return prefCache.value;
}

function notifyPrefs() {
  prefListeners.forEach((l) => l());
}

export function savePrefs(p: Prefs) {
  write(PREFS_KEY, p);
  // Only the language goes in a cookie, so the server can set <html lang>. Needs never do.
  try {
    document.cookie = `bj_lang=${p.lang}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {}
  notifyPrefs();
}

export function loadCases(): StoredCase[] {
  return read<StoredCase[]>(CASES_KEY) ?? [];
}

export function saveCase(c: StoredCase) {
  write(CASES_KEY, [c, ...loadCases().filter((x) => x.id !== c.id)]);
}

export function getStoredCase(id: string): StoredCase | undefined {
  return loadCases().find((c) => c.id === id);
}

export function loadProgress(caseId: string): Progress {
  return read<Progress>(progressKey(caseId)) ?? { current: 0, done: [], skipped: [], updatedAt: new Date().toISOString() };
}

export function saveProgress(caseId: string, p: Progress) {
  write(progressKey(caseId), { ...p, updatedAt: new Date().toISOString() });
}

export function loadSeenDocs(caseId: string): string[] {
  return read<string[]>(seenDocsKey(caseId)) ?? [];
}

export function saveSeenDocs(caseId: string, ids: string[]) {
  write(seenDocsKey(caseId), ids);
}

/** Everything this app stored on the device, for "export my settings". */
export function exportAll(): string {
  const out: Record<string, unknown> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith("bj.")) out[k] = read(k);
    }
  } catch {}
  return JSON.stringify(out, null, 2);
}

export function importAll(json: string): boolean {
  try {
    const data = JSON.parse(json) as Record<string, unknown>;
    if (typeof data !== "object" || data === null) return false;
    for (const [k, v] of Object.entries(data)) if (k.startsWith("bj.")) write(k, v);
    notifyPrefs();
    return true;
  } catch {
    return false;
  }
}

export function clearAll() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("bj."))
      .forEach((k) => localStorage.removeItem(k));
    document.cookie = "bj_lang=; path=/; max-age=0";
  } catch {}
  notifyPrefs();
}

/** Script run before first paint so font size and colour modes never flash. */
export const PREFS_BOOT_SCRIPT = `(function(){try{var p=JSON.parse(localStorage.getItem("${PREFS_KEY}")||"{}");var d=document.documentElement;d.dataset.font=p.fontSize||"m";if(p.reducedMotion)d.dataset.motion="reduce";if(p.calmColors)d.dataset.calm="1";if(p.highContrast)d.dataset.contrast="high";if(p.dyslexiaFont)d.dataset.readable="1";if(p.lang)d.lang=p.lang}catch(e){}})()`;
