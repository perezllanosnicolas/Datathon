"use client";

import { useEffect, useState } from "react";
import { LOCALE, usePrefs } from "./PrefsProvider";

const PATHS = {
  sound: "M3 9v6h4l5 4V5L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z",
  doc: "M6 2h8l4 4v16H6V2zm8 0v4h4M9 12h6M9 16h6",
  info: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 8v7m0-10v.01",
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0",
  speech: "M4 4h16v11H8l-4 4V4z",
  calm: "M12 21c-4-3-8-6.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 4.5-4 8-8 11z",
  scale: "M12 3v18M5 7h14M5 7l-3 7h6L5 7zm14 0l-3 7h6l-3-7zM8 21h8",
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 5v5l3 3",
  place: "M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zm-7 9a7 7 0 0 0 14 0M12 19v3",
  home: "M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10",
  steps: "M4 20h4v-4h4v-4h4V8h4M4 20V4",
  book: "M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6M20 4v14h-6",
  sliders: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4",
  chevron: "M9 6l6 6-6 6",
  stop: "M7 7h10v10H7z",
} as const;

export type IconName = keyof typeof PATHS;

/** Decorative icon: always paired with visible text (docs/04 §4). */
export function Icon({ name }: { name: IconName }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} />
    </svg>
  );
}

export function Note({ icon, title, tone, children }: { icon?: IconName; title?: string; tone?: "warn" | "ok" | "lawyer"; children: React.ReactNode }) {
  return (
    <div className={`note${tone ? ` note-${tone}` : ""}`}>
      {title && (
        <p className="note-title">
          {icon && <Icon name={icon} />}
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

/**
 * Text-to-speech in the chosen language, as an icon-only round button: press to listen,
 * press again to stop. Shown unless the person switched it off in the settings.
 */
export function ReadAloud({ text }: { text: string }) {
  const { prefs, t } = usePrefs();
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  // New text (next step) or leaving the page: stop talking.
  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
      setSpeaking(false);
    };
  }, [supported, text]);

  if (!prefs.readAloud || !supported) return null;

  function toggle() {
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LOCALE[prefs.lang];
    u.rate = 0.9;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(u);
    setSpeaking(true);
  }

  return (
    <button type="button" className="btn-read" onClick={toggle} aria-pressed={speaking} aria-label={speaking ? t.flow.stop : t.flow.readAloud} title={speaking ? t.flow.stop : t.flow.readAloud}>
      <Icon name={speaking ? "stop" : "sound"} />
    </button>
  );
}

export function formatDateTime(iso: string, lang: keyof typeof LOCALE): string {
  return new Date(iso).toLocaleString(LOCALE[lang], { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}
