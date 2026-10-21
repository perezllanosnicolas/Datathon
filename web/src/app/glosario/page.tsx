"use client";

import { glossary, tr } from "@/lib/catalog";
import { usePrefs } from "@/components/PrefsProvider";

export default function Glossary() {
  const { t, prefs } = usePrefs();
  return (
    <>
      <h1>{t.glossary.title}</h1>
      <p>{t.glossary.intro}</p>
      <dl>
        {glossary.map((g) => {
          const term = tr(g.term, prefs.lang);
          const def = tr(g.definition, prefs.lang);
          return (
            <div key={g.id} className="card">
              <dt lang={term.fallback ? "es" : undefined}>
                <strong>{term.text}</strong>
              </dt>
              <dd lang={def.fallback ? "es" : undefined} style={{ margin: 0 }}>
                {def.text}
              </dd>
            </div>
          );
        })}
      </dl>
    </>
  );
}
