"use client";

import { useMemo, useState } from "react";
import { glossary, normalize, tr } from "@/lib/catalog";
import { fmt, usePrefs } from "@/components/PrefsProvider";
import { TextField } from "@/components/TextField";

export default function Glossary() {
  const { t, prefs } = usePrefs();
  const [q, setQ] = useState("");

  const entries = useMemo(
    () =>
      glossary
        .map((g) => ({ id: g.id, term: tr(g.term, prefs.lang), def: tr(g.definition, prefs.lang) }))
        .sort((a, b) => (a.term.text ?? "").localeCompare(b.term.text ?? "", prefs.lang)),
    [prefs.lang],
  );
  const nq = normalize(q);
  const shown = nq ? entries.filter((e) => normalize(`${e.term.text} ${e.def.text}`).includes(nq)) : entries;

  return (
    <>
      <h1>{t.glossary.title}</h1>
      <p>{t.glossary.intro}</p>
      <TextField id="glossary-search" type="search" label={t.glossary.search} value={q} onChange={setQ} />
      <p className="small muted" role="status" aria-live="polite">
        {shown.length ? fmt(t.glossary.count, { n: shown.length }) : t.glossary.empty}
      </p>
      <dl>
        {shown.map((e) => (
          <div key={e.id} className="card">
            <dt lang={e.term.fallback ? "es" : undefined}>
              <strong>{e.term.text}</strong>
            </dt>
            <dd lang={e.def.fallback ? "es" : undefined} style={{ margin: 0 }}>
              {e.def.text}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
