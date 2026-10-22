"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { t1, type DocKind } from "@/lib/catalog";
import { loadProgress, saveProgress } from "@/lib/storage";
import { ClientOnly, fmt, usePrefs } from "@/components/PrefsProvider";
import { Note } from "@/components/ui";
import { FlowMap } from "@/components/FlowMap";
import { useCase } from "@/components/useCase";

export default function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <ClientOnly fallback={<p>…</p>}>
      <Summary id={id} />
    </ClientOnly>
  );
}

function Summary({ id }: { id: string }) {
  const { t, prefs } = usePrefs();
  const router = useRouter();
  const { stored, procedure, court, data } = useCase(id);
  const [progress] = useState(() => loadProgress(id));

  if (!stored || !procedure || !court) {
    return (
      <>
        <h1>{t.flow.caseNotFound}</h1>
        <Link className="btn btn-primary" href="/elegir">
          {t.home.newCase}
        </Link>
      </>
    );
  }

  const lang = prefs.lang;
  const allDone = procedure.steps.every((s) => progress.done.includes(s.id) || progress.skipped.includes(s.id));
  const lawyerDocs = data?.documents.filter((d) => d.addedBy === "lawyer" && d.status !== "rejected") ?? [];

  const list = (kind: DocKind) => {
    const items = [
      ...procedure.steps.flatMap((s) => s.documents.filter((d) => d.kind === kind).map((d) => ({ id: d.id, name: t1(d.name, lang)!, lawyer: false }))),
      ...lawyerDocs.filter((d) => d.kind === kind).map((d) => ({ id: d.id, name: d.name, lawyer: true })),
    ];
    return (
      <ul>
        {items.map((d) => (
          <li key={d.id}>
            {d.name}
            {d.lawyer && <span className="small">. {t.docs.addedByLawyer}</span>}
            {progress.checked?.includes(d.id) && <span className="tag tag-ok">{t.summary.ready}</span>}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <h1>{t.summary.title}</h1>
      {allDone && (
        <Note tone="ok" title={t.flow.allDone}>
          <p>{fmt(t.flow.doneLeft, { done: progress.done.length, left: 0 })}</p>
        </Note>
      )}
      <dl className="card facts">
        <dt>{t.confirm.procedure}</dt>
        <dd>{t1(procedure.name, lang)}</dd>
        <dt>{t.confirm.court}</dt>
        <dd>
          {t1(court.name, lang)}
          <br />
          <span className="muted small">{court.address}</span>
        </dd>
      </dl>

      <h2>{t.summary.bringList}</h2>
      {list("bring")}
      <h2>{t.summary.receiveList}</h2>
      {list("receive")}

      <FlowMap
        steps={procedure.steps}
        court={court}
        openAll
        statusOf={(i) => {
          const s = procedure.steps[i].id;
          return progress.done.includes(s) ? "done" : progress.skipped.includes(s) ? "skipped" : "pending";
        }}
      />

      <p className="muted small">{t1(procedure.legalBasis, lang)}</p>

      <div className="btn-stack">
        <Link className="btn btn-primary btn-block" href={`/caso/${id}`}>
          {t.summary.back}
        </Link>
        <Link className="btn btn-secondary btn-block" href={`/caso/${id}/abogado`}>
          {t.invite.open}
        </Link>
        <button type="button" className="btn btn-secondary btn-block" onClick={() => window.print()}>
          {t.summary.print}
        </button>
        <button
          type="button"
          className="btn btn-quiet btn-block"
          onClick={() => {
            saveProgress(id, { ...progress, current: 0, done: [], skipped: [] });
            router.push(`/caso/${id}`);
          }}
        >
          {t.summary.restart}
        </button>
      </div>
    </>
  );
}
