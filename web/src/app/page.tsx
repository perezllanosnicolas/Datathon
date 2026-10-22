"use client";

import Link from "next/link";
import { useState } from "react";
import { getCourt, getProcedure, t1 } from "@/lib/catalog";
import { loadCases, loadProgress } from "@/lib/storage";
import { ClientOnly, fmt, usePrefs } from "@/components/PrefsProvider";
import { StepImage } from "@/components/StepImage";

export default function Home() {
  const { prefs, ready, t } = usePrefs();

  return (
    <>
      <section className="home-hero">
        <div>
          <h1>{t.home.title}</h1>
          <p className="lead">{t.home.intro1}</p>
          <p>{t.home.intro2}</p>
          <p className="muted">{t.home.intro3}</p>
          <div className="btn-stack">
            {ready && !prefs.onboarded ? (
              <Link className="btn btn-primary btn-block" href="/cuestionario">
                {t.home.start}
              </Link>
            ) : (
              <>
                <Link className="btn btn-primary btn-block" href="/elegir">
                  {t.home.newCase}
                </Link>
                <Link className="btn btn-secondary btn-block" href="/ajustes">
                  {t.home.adjust}
                </Link>
              </>
            )}
          </div>
        </div>
        <StepImage slot="arrival" caption={false} />
      </section>

      <ClientOnly>
        <MyCases />
      </ClientOnly>

      <section aria-labelledby="how" className="how">
        <h2 id="how">{t.home.how}</h2>
        <ol className="how-list">
          <li>
            <StepImage slot="prepare" size="sm" caption={false} />
            <span>{t.home.how1}</span>
          </li>
          <li>
            <StepImage slot="find-room" size="sm" caption={false} />
            <span>{t.home.how2}</span>
          </li>
          <li>
            <StepImage slot="enter-room" size="sm" caption={false} />
            <span>{t.home.how3}</span>
          </li>
        </ol>
      </section>

    </>
  );
}

function MyCases() {
  const { prefs, t } = usePrefs();
  const [cases] = useState(loadCases);
  if (!cases.length) return null;

  return (
    <section aria-labelledby="my-cases">
      <h2 id="my-cases">{t.home.myCases}</h2>
      <ul className="result-list">
        {cases.map((c) => {
          const p = getProcedure(c.procedureId);
          const court = getCourt(c.courtId);
          if (!p || !court) return null;
          const prog = loadProgress(c.id);
          const left = Math.max(p.steps.length - prog.done.length - prog.skipped.length, 0);
          return (
            <li key={c.id} className="card">
              <p>
                <strong>{t1(p.name, prefs.lang)}</strong>
                <br />
                {t1(court.name, prefs.lang)}
              </p>
              <p className="muted small">{fmt(t.flow.doneLeft, { done: prog.done.length, left })}</p>
              <Link className="btn btn-secondary btn-block" href={`/caso/${c.id}`}>
                {t.home.open}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
