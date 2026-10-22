"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { courts, getProcedure, LANGUAGES, normalize, procedures, t1, type Court, type Procedure } from "@/lib/catalog";
import { fmt, usePrefs } from "@/components/PrefsProvider";
import { TextField } from "@/components/TextField";

// Search with filters (TRD §2b). Searches every language, tolerant to accents.
function matchProcedure(p: Procedure, q: string): boolean {
  const words = normalize(q).split(" ").filter(Boolean);
  if (words.length === 0) return true;
  const hay = normalize(
    [...LANGUAGES.map((l) => p.name[l] ?? ""), ...LANGUAGES.flatMap((l) => p.searchTerms[l] ?? [])].join(" "),
  );
  return words.every((w) => hay.includes(w));
}

function matchCourt(c: Court, q: string): boolean {
  const words = normalize(q).split(" ").filter(Boolean);
  if (words.length === 0) return true;
  const hay = normalize([c.city, c.address, ...c.searchTerms, ...LANGUAGES.map((l) => c.name[l] ?? "")].join(" "));
  return words.every((w) => hay.includes(w));
}

function SearchInner() {
  const { t, prefs } = usePrefs();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [type, setType] = useState<"all" | "civil">("all");
  const [procedureId, setProcedureId] = useState<string | null>(params.get("p"));
  const [courtQ, setCourtQ] = useState(params.get("cq") ?? "");
  const courtHeading = useRef<HTMLHeadingElement>(null);

  const procedure = procedureId ? getProcedure(procedureId) : undefined;
  useEffect(() => {
    if (procedure) courtHeading.current?.focus();
  }, [procedure]);

  const results = procedures.filter((p) => (type === "all" || p.processType === type) && matchProcedure(p, q));
  const courtResults = procedure ? courts.filter((c) => c.processTypes.includes(procedure.processType) && matchCourt(c, courtQ)) : [];

  if (procedure) {
    return (
      <>
        <h1 ref={courtHeading} tabIndex={-1}>
          {t.search.courtTitle}
        </h1>
        <p className="lead">
          {t.search.selectedProcedure}: <strong>{t1(procedure.name, prefs.lang)}</strong>
        </p>
        <TextField id="court-q" type="search" label={t.search.courtLabel} hint={t.search.courtHint} value={courtQ} onChange={setCourtQ} />
        <p role="status" aria-live="polite" className="muted">
          {courtResults.length ? fmt(t.search.results, { n: courtResults.length }) : t.search.noResults}
        </p>
        <ul className="result-list">
          {courtResults.map((c) => (
            <li key={c.id} className="card">
              <p>
                <strong>{t1(c.name, prefs.lang)}</strong>
                <br />
                <span className="muted">{c.address}</span>
              </p>
              <Link className="btn btn-primary btn-block" href={`/confirmar?p=${procedure.id}&c=${c.id}&src=search`}>
                {t.search.choose}
              </Link>
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn-quiet" onClick={() => setProcedureId(null)}>
          {t.quiz.back}
        </button>
      </>
    );
  }

  return (
    <>
      <h1>{t.search.title}</h1>
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <TextField id="q" type="search" label={t.search.label} hint={t.search.hint} value={q} onChange={setQ} />
        <p className="label" id="type-label">
          {t.search.filterType}
        </p>
        <ul className="chips" aria-labelledby="type-label">
          {(["all", "civil"] as const).map((v) => (
            <li key={v}>
              <button type="button" className="chip" aria-pressed={type === v} onClick={() => setType(v)}>
                {v === "all" ? t.search.all : t.search.civil}
              </button>
            </li>
          ))}
        </ul>
      </form>
      <p role="status" aria-live="polite" className="muted">
        {results.length ? fmt(t.search.results, { n: results.length }) : t.search.noResults}
      </p>
      <ul className="result-list">
        {results.map((p) => (
          <li key={p.id} className="card">
            <p>
              <strong>{t1(p.name, prefs.lang)}</strong>
            </p>
            <p className="muted small">{t1(p.summary, prefs.lang)}</p>
            <button type="button" className="btn btn-primary btn-block" onClick={() => setProcedureId(p.id)}>
              {t.search.choose}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchInner />
    </Suspense>
  );
}
