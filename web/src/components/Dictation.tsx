"use client";

import { useEffect, useRef, useState } from "react";
import { fmt, LOCALE, useHydrated, usePrefs } from "./PrefsProvider";
import { Icon } from "./ui";

// Voice dictation with the browser's Web Speech API (no extra library, nothing on our server).
// It needs a secure context (https or localhost) and is hidden where it is not available.

interface Recognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  abort(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

type RecognitionCtor = new () => Recognition;

function recognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined" || !window.isSecureContext) return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function dictationAvailable(): boolean {
  return recognitionCtor() !== null;
}

/** A visible "Dictar" button for one field. Appends what was heard to the field. */
export function DictateButton({ field, onText }: { field: string; onText: (text: string) => void }) {
  const { prefs, t } = usePrefs();
  const hydrated = useHydrated();
  const [state, setState] = useState<"idle" | "listening" | "error">("idle");
  const rec = useRef<Recognition | null>(null);

  useEffect(() => () => rec.current?.abort(), []);

  if (!hydrated || !prefs.dictation) return null;
  const Ctor = recognitionCtor();
  if (!Ctor) return null;

  function toggle() {
    if (state === "listening") {
      rec.current?.abort();
      setState("idle");
      return;
    }
    const r = new Ctor!();
    r.lang = LOCALE[prefs.lang];
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      const text = Array.from(e.results)
        .map((res) => res[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (text) onText(text);
    };
    r.onerror = () => setState("error");
    r.onend = () => setState((s) => (s === "listening" ? "idle" : s));
    rec.current = r;
    setState("listening");
    r.start();
  }

  return (
    <>
      <button type="button" className="btn btn-quiet btn-dictate" onClick={toggle} aria-pressed={state === "listening"} aria-label={state === "listening" ? `${t.dictation.stop}: ${field}` : fmt(t.dictation.label, { field })} title={t.dictation.privacy}>
        <Icon name="mic" />
        <span>{state === "listening" ? t.dictation.stop : t.dictation.start}</span>
      </button>
      <span className="dictate-status small" role="status" aria-live="polite">
        {state === "listening" ? t.dictation.listening : state === "error" ? t.dictation.error : ""}
      </span>
    </>
  );
}

/** Joins dictated text to what is already in a field. */
export const appendText = (current: string, heard: string) => (current.trim() ? `${current.trim()} ${heard}` : heard);
