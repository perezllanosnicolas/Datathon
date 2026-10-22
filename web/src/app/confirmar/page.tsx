"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getCourt, getProcedure, t1 } from "@/lib/catalog";
import { createCase } from "@/lib/cases";
import { usePrefs } from "@/components/PrefsProvider";
import { FlowMap } from "@/components/FlowMap";

function ConfirmInner() {
  const { t, prefs } = usePrefs();
  const router = useRouter();
  const params = useSearchParams();
  const procedure = getProcedure(params.get("p") ?? "");
  const court = getCourt(params.get("c") ?? "");
  const source = params.get("src") === "citation" ? "citation" : "search";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!procedure || !court) {
    return (
      <>
        <h1>{t.confirm.title}</h1>
        <p>{t.search.noResults}</p>
        <Link className="btn btn-primary" href="/buscar">
          {t.search.title}
        </Link>
      </>
    );
  }

  async function ok() {
    setBusy(true);
    setError("");
    try {
      const id = await createCase(procedure!.id, court!.id, source);
      router.push(`/caso/${id}`);
    } catch {
      setError(t.errors.network);
      setBusy(false);
    }
  }

  return (
    <>
      <h1>{t.confirm.title}</h1>
      <dl className="card facts">
        <dt>{t.confirm.procedure}</dt>
        <dd>{t1(procedure.name, prefs.lang)}</dd>
        <dt>{t.confirm.court}</dt>
        <dd>
          {t1(court.name, prefs.lang)}
          <br />
          <span className="muted small">{court.address}</span>
        </dd>
      </dl>
      <p role="status" aria-live="polite">
        {busy ? t.confirm.creating : error}
      </p>
      <div className="btn-row">
        <Link className="btn btn-secondary" href={`/buscar?p=${procedure.id}`}>
          {t.confirm.change}
        </Link>
        <button type="button" className="btn btn-primary" onClick={ok} disabled={busy}>
          {t.confirm.ok}
        </button>
      </div>
      <FlowMap steps={procedure.steps} court={court} />
    </>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmInner />
    </Suspense>
  );
}
