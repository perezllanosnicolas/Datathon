"use client";

import { useState } from "react";
import { LANGUAGES, normalize, type Lang } from "@/lib/catalog";
import { NEEDS, type FontSize, type Need, type Prefs } from "@/lib/storage";
import { usePrefs } from "./PrefsProvider";
import { es } from "@/i18n/es";
import { ca } from "@/i18n/ca";
import { gl } from "@/i18n/gl";
import { eu } from "@/i18n/eu";

const NATIVE: Record<Lang, string> = { es: es.app.langName, ca: ca.app.langName, gl: gl.app.langName, eu: eu.app.langName };

/** Adjustments each need suggests. Only switches things on; the person can switch them off. */
const NEED_DEFAULTS: Record<Need, Partial<Prefs>> = {
  tea: { reducedMotion: true, calmColors: true },
  tdah: { reducedMotion: true },
  dislexia: { dyslexiaFont: true, readAloud: true },
  discalculia: {},
  disgrafia: {},
  vision: { fontSize: "xl", highContrast: true, readAloud: true },
  otras: {},
};

export function LanguageField({ legend }: { legend: string }) {
  const { prefs, setPrefs } = usePrefs();
  return (
    <fieldset>
      <legend>{legend}</legend>
      <ul className="choice-list">
        {LANGUAGES.map((l) => (
          <li key={l}>
            <label className="choice" lang={l}>
              <input type="radio" name="lang" value={l} checked={prefs.lang === l} onChange={() => setPrefs({ lang: l })} />
              <strong>{NATIVE[l]}</strong>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

export function FontField({ legend }: { legend: string }) {
  const { prefs, setPrefs, t } = usePrefs();
  const options: { v: FontSize; label: string; size: string }[] = [
    { v: "m", label: t.quiz.fontNormal, size: "18px" },
    { v: "l", label: t.quiz.fontLarge, size: "21px" },
    { v: "xl", label: t.quiz.fontXL, size: "25px" },
  ];
  return (
    <fieldset>
      <legend>{legend}</legend>
      <ul className="choice-list">
        {options.map((o) => (
          <li key={o.v}>
            <label className="choice">
              <input type="radio" name="font" value={o.v} checked={prefs.fontSize === o.v} onChange={() => setPrefs({ fontSize: o.v })} />
              <span style={{ fontSize: o.size }}>{o.label}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="card">{t.quiz.sample}</p>
    </fieldset>
  );
}

export function NeedsField({ legend }: { legend: string }) {
  const { prefs, setPrefs, t } = usePrefs();
  const [q, setQ] = useState("");

  const items = NEEDS.map((n) => ({ id: n, name: t.needs[n], desc: t.needs[`${n}Desc` as const] }));
  const nq = normalize(q);
  const shown = nq ? items.filter((i) => normalize(`${i.name} ${i.desc}`).includes(nq)) : items;

  function toggle(n: Need, on: boolean) {
    const needs = on ? [...prefs.needs, n] : prefs.needs.filter((x) => x !== n);
    setPrefs({ needs, ...(on ? NEED_DEFAULTS[n] : {}) });
  }

  return (
    <fieldset>
      <legend>{legend}</legend>
      <p className="hint">{t.quiz.needsHelp}</p>
      <div className="field">
        <label htmlFor="needs-search">{t.quiz.needsSearch}</label>
        <input id="needs-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      </div>
      <ul className="choice-list">
        {shown.map((i) => (
          <li key={i.id}>
            <label className="choice">
              <input type="checkbox" checked={prefs.needs.includes(i.id)} onChange={(e) => toggle(i.id, e.target.checked)} />
              <span>
                <strong>{i.name}</strong>
                <span className="small">
                  {t.quiz.changes} {i.desc}
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

export function ExtrasField({ legend }: { legend: string }) {
  const { prefs, setPrefs, t } = usePrefs();
  const toggles: { key: "reducedMotion" | "calmColors" | "highContrast" | "readAloud" | "dyslexiaFont"; label: string }[] = [
    { key: "dyslexiaFont", label: t.quiz.dyslexiaFont },
    { key: "readAloud", label: t.quiz.readAloud },
    { key: "highContrast", label: t.quiz.highContrast },
    { key: "calmColors", label: t.quiz.calmColors },
    { key: "reducedMotion", label: t.quiz.reducedMotion },
  ];
  return (
    <fieldset>
      <legend>{legend}</legend>
      <ul className="choice-list">
        {toggles.map((x) => (
          <li key={x.key}>
            <label className="choice">
              <input type="checkbox" checked={prefs[x.key]} onChange={(e) => setPrefs({ [x.key]: e.target.checked })} />
              <span>{x.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
