"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { courts, procedures, t1 } from "@/lib/catalog";
import { createCase } from "@/lib/cases";
import type { Extraction } from "@/lib/extract";
import { LOCALE, usePrefs } from "@/components/PrefsProvider";
import { Icon, Note } from "@/components/ui";

type State = { kind: "idle" } | { kind: "reading" } | { kind: "error"; message: string } | { kind: "result"; data: Extraction };

const MAX_BYTES = 8 * 1024 * 1024;
// Vercel rejects request bodies over 4.5 MB, so large phone photos are shrunk before upload.
const SHRINK_OVER = 3.5 * 1024 * 1024;
const SHRINK_SIDE = 2400;

async function shrinkPhoto(file: File): Promise<File> {
  if (file.size <= SHRINK_OVER || !file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, SHRINK_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    return blob && blob.size < file.size ? new File([blob], "citacion.jpg", { type: "image/jpeg" }) : file;
  } catch {
    return file;
  }
}

export default function CitationPage() {
  const { t, prefs } = usePrefs();
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: "idle" });
  const [procedureId, setProcedureId] = useState("");
  const [courtId, setCourtId] = useState("");
  const [busy, setBusy] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state.kind === "result") resultHeading.current?.focus();
  }, [state.kind]);

  async function send(file: File) {
    if (file.size > MAX_BYTES) return setState({ kind: "error", message: t.citation.errorSize });
    setState({ kind: "reading" });
    const form = new FormData();
    form.append("file", await shrinkPhoto(file));
    try {
      const res = await fetch("/api/citation", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        const message =
          data.error === "bad_type" ? t.citation.errorType : data.error === "too_big" ? t.citation.errorSize : data.error === "rate_limited" ? t.lawyer.tooMany : t.citation.errorRead;
        return setState({ kind: "error", message });
      }
      const ex = data as Extraction;
      setProcedureId(ex.procedures[0]?.id ?? "");
      setCourtId(ex.courts[0]?.id ?? "");
      setState({ kind: "result", data: ex });
    } catch {
      setState({ kind: "error", message: t.errors.network });
    } finally {
      if (photoRef.current) photoRef.current.value = "";
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function confirm() {
    setBusy(true);
    try {
      const id = await createCase(procedureId, courtId, "citation");
      router.push(`/caso/${id}`);
    } catch {
      setBusy(false);
      setState({ kind: "error", message: t.errors.network });
    }
  }

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) send(f);
  };

  return (
    <>
      <h1>{t.citation.title}</h1>

      {state.kind !== "result" && (
        <>
          <Note icon="info">
            <ul>
              <li>{t.citation.explain1}</li>
              <li>{t.citation.explain2}</li>
              <li>{t.citation.explain3}</li>
              <li>{t.citation.explain4}</li>
            </ul>
          </Note>
          <div className="btn-stack">
            <button type="button" className="btn btn-primary btn-block" onClick={() => photoRef.current?.click()} disabled={state.kind === "reading"}>
              {t.citation.photo}
            </button>
            <button type="button" className="btn btn-block" onClick={() => fileRef.current?.click()} disabled={state.kind === "reading"}>
              <Icon name="doc" />
              {t.citation.file}
            </button>
          </div>
          <p className="hint">{t.citation.formats}</p>
          <input ref={photoRef} type="file" accept="image/*" capture="environment" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onPick} />
          <input ref={fileRef} type="file" accept="application/pdf,image/jpeg,image/png,text/plain" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onPick} />
        </>
      )}

      <div role="status" aria-live="polite">
        {state.kind === "reading" && <p className="card">{t.citation.reading}</p>}
        {state.kind === "error" && (
          <Note tone="warn" title={state.message}>
            <Link className="btn" href="/buscar">
              {t.citation.goSearch}
            </Link>
          </Note>
        )}
      </div>

      {state.kind === "result" && (
        <section aria-labelledby="detected">
          <h2 id="detected" ref={resultHeading} tabIndex={-1}>
            {t.citation.detectedTitle}
          </h2>
          <p>{t.citation.detectedHelp}</p>
          <p className="muted small">{t.citation.explain4}</p>

          <div className="field">
            <label htmlFor="det-proc">{t.confirm.procedure}</label>
            {!state.data.procedures.length && <p className="field-error">{t.citation.notFoundProcedure}</p>}
            <select id="det-proc" value={procedureId} onChange={(e) => setProcedureId(e.target.value)}>
              <option value="">{t.citation.pick}</option>
              {procedures.map((p) => (
                <option key={p.id} value={p.id}>
                  {t1(p.name, prefs.lang)}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="det-court">{t.confirm.court}</label>
            {!state.data.courts.length && <p className="field-error">{t.citation.notFoundCourt}</p>}
            <select id="det-court" value={courtId} onChange={(e) => setCourtId(e.target.value)}>
              <option value="">{t.citation.pick}</option>
              {courts.map((c) => (
                <option key={c.id} value={c.id}>
                  {t1(c.name, prefs.lang)}
                </option>
              ))}
            </select>
          </div>

          {(state.data.date || state.data.time) && (
            <dl className="card facts">
              {state.data.date && (
                <>
                  <dt>{t.confirm.date}</dt>
                  <dd>{new Date(`${state.data.date}T12:00:00`).toLocaleDateString(LOCALE[prefs.lang], { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</dd>
                </>
              )}
              {state.data.time && (
                <>
                  <dt>{t.confirm.time}</dt>
                  <dd>{state.data.time}</dd>
                </>
              )}
            </dl>
          )}

          <div className="btn-row">
            <Link className="btn" href={procedureId ? `/buscar?p=${procedureId}` : "/buscar"}>
              {t.citation.goSearch}
            </Link>
            <button type="button" className="btn btn-primary" disabled={!procedureId || !courtId || busy} onClick={confirm}>
              {busy ? t.confirm.creating : t.confirm.ok}
            </button>
          </div>
        </section>
      )}
    </>
  );
}
