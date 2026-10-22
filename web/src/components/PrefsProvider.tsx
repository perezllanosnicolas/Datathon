"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useSyncExternalStore } from "react";
import type { Lang } from "@/lib/catalog";
import { DEFAULT_PREFS, getPrefsSnapshot, savePrefs, subscribePrefs, type Prefs } from "@/lib/storage";
import { es, type Messages } from "@/i18n/es";
import { ca } from "@/i18n/ca";
import { gl } from "@/i18n/gl";
import { eu } from "@/i18n/eu";

const MESSAGES: Record<Lang, Messages> = { es, ca, gl, eu };

interface PrefsContextValue {
  prefs: Prefs;
  /** False on the server and during hydration; true once device prefs are read. */
  ready: boolean;
  setPrefs: (update: Partial<Prefs>) => void;
  t: Messages;
}

const PrefsContext = createContext<PrefsContextValue | null>(null);

function applyToDocument(p: Prefs) {
  const d = document.documentElement;
  d.lang = p.lang;
  d.dataset.font = p.fontSize;
  const toggle = (key: string, on: boolean, value = "1") => {
    if (on) d.dataset[key] = value;
    else delete d.dataset[key];
  };
  toggle("motion", p.reducedMotion, "reduce");
  toggle("calm", p.calmColors);
  toggle("contrast", p.highContrast, "high");
  toggle("typeface", p.typeface !== "app", p.typeface);
}

const noopSubscribe = () => () => {};

/** True only after hydration, so device-only content never mismatches the server HTML. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function PrefsProvider({ initialLang, children }: { initialLang: Lang; children: React.ReactNode }) {
  const serverPrefs = useMemo<Prefs>(() => ({ ...DEFAULT_PREFS, lang: initialLang }), [initialLang]);
  const prefs = useSyncExternalStore(subscribePrefs, getPrefsSnapshot, () => serverPrefs);
  const ready = useHydrated();

  // Keep <html> attributes in sync (also re-applies them after the dev Strict Mode remount).
  useLayoutEffect(() => applyToDocument(prefs), [prefs]);

  const setPrefs = useCallback((update: Partial<Prefs>) => savePrefs({ ...getPrefsSnapshot(), ...update }), []);

  const value = useMemo(() => ({ prefs, ready, setPrefs, t: MESSAGES[prefs.lang] ?? es }), [prefs, ready, setPrefs]);
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside PrefsProvider");
  return ctx;
}

/** Renders children only on the client, after hydration. */
export function ClientOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return useHydrated() ? children : fallback;
}

/** Replaces {name} placeholders. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export const LOCALE: Record<Lang, string> = { es: "es-ES", ca: "ca-ES", gl: "gl-ES", eu: "eu-ES" };
