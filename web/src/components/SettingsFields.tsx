"use client";

import { useState } from "react";
import { LANGUAGES, normalize, type Lang } from "@/lib/catalog";
import { NEEDS, type FontSize, type ImageMode, type Need, type Prefs } from "@/lib/storage";
import { usePrefs } from "./PrefsProvider";
import { StepImage } from "./StepImage";
import { TextField } from "./TextField";
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
  disgrafia: { dictation: true },
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

export function ImagesField({ legend }: { legend: string }) {
  const { prefs, setPrefs, t } = usePrefs();
  const options: { v: ImageMode; label: string; desc: string }[] = [
    { v: "picto", label: t.quiz.imgPicto, desc: t.quiz.imgPictoDesc },
    { v: "real", label: t.quiz.imgReal, desc: t.quiz.imgRealDesc },
    { v: "none", label: t.quiz.imgNone, desc: t.quiz.imgNoneDesc },
  ];
  return (
    <fieldset>
      <legend>{legend}</legend>
      <ul className="choice-list image-choices">
        {options.map((o) => (
          <li key={o.v}>
            <label className="choice">
              <input type="radio" name="imageMode" value={o.v} checked={prefs.imageMode === o.v} onChange={() => setPrefs({ imageMode: o.v })} />
              <span className="choice-text">
                <strong>{o.label}</strong>
                <span className="small">{o.desc}</span>
              </span>
              {o.v !== "none" && <StepImage slot="arrival" size="sm" mode={o.v} caption={false} />}
            </label>
          </li>
        ))}
      </ul>
      {prefs.imageMode === "real" && <p className="hint">{t.images.realNote}</p>}
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
      <TextField id="needs-search" type="search" label={t.quiz.needsSearch} value={q} onChange={setQ} />
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
  const toggles: { key: "reducedMotion" | "calmColors" | "highContrast" | "readAloud" | "dyslexiaFont" | "dictation"; label: string; note?: string }[] = [
    { key: "dyslexiaFont", label: t.quiz.dyslexiaFont },
    { key: "readAloud", label: t.quiz.readAloud },
    { key: "dictation", label: t.quiz.dictation, note: t.dictation.privacy },
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
              <span>
                <strong>{x.label}</strong>
                {x.note && <span className="small muted">{x.note}</span>}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
