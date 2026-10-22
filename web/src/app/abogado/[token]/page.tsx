"use client";

import { use, useCallback, useEffect, useState } from "react";
import { getCourt, getProcedure, LANGUAGES, t1, type Lang } from "@/lib/catalog";
import { api, ApiError } from "@/lib/api";
import { es, type Messages } from "@/i18n/es";
import { ca } from "@/i18n/ca";
import { gl } from "@/i18n/gl";
import { eu } from "@/i18n/eu";
import { fmt, usePrefs } from "@/components/PrefsProvider";
import { formatDateTime, Note } from "@/components/ui";
import { TextField } from "@/components/TextField";

const MESSAGES: Record<Lang, Messages> = { es, ca, gl, eu };

interface LinkData {
  procedureId: string;
  courtId: string;
  language: Lang;
  expiresAt: string;
  lawyer: { name: string; barNumber: string } | null;
  documents: { id: string; name: string; kind: "bring" | "receive"; notes: string | null }[];
}

// Lawyer screen (AppFlow §2.2b): identify, then add documents. Sees only procedure and court.
export default function LawyerPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const { prefs } = usePrefs();
  const [data, setData] = useState<LinkData | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "invalid">("loading");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [bar, setBar] = useState("");
  const [docName, setDocName] = useState("");
  const [docNotes, setDocNotes] = useState("");
  const [kind, setKind] = useState<"bring" | "receive">("bring");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchLink = useCallback(() => api<LinkData>(`/api/lawyer/${token}`), [token]);

  const load = useCallback(async () => {
    try {
      setData(await fetchLink());
      setState("ok");
    } catch {
      setState("invalid");
    }
  }, [fetchLink]);

  useEffect(() => {
    let alive = true;
    fetchLink()
      .then((d) => {
        if (!alive) return;
        setData(d);
        setState("ok");
      })
      .catch(() => alive && setState("invalid"));
    return () => {
      alive = false;
    };
  }, [fetchLink]);

  // The screen uses the language the person chose for the link.
  const lang: Lang = data && LANGUAGES.includes(data.language) ? data.language : prefs.lang;
  const t = MESSAGES[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  if (state === "loading") return <p>…</p>;
  if (state === "invalid" || !data) {
    return (
      <>
        <h1>{t.lawyer.title}</h1>
        <Note tone="warn" title={t.lawyer.invalid}>
          <p>{t.app.disclaimer}</p>
        </Note>
      </>
    );
  }

  const procedure = getProcedure(data.procedureId);
  const court = getCourt(data.courtId);

  const fail = (e: unknown) => {
    if (e instanceof ApiError && e.status === 429) setMessage(t.lawyer.tooMany);
    else if (e instanceof ApiError && e.status === 404) setState("invalid");
    else setMessage(t.errors.generic);
  };

  async function identify(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = t.lawyer.required;
    if (!bar.trim()) errs.bar = t.lawyer.required;
    else if (!/^[A-Za-z0-9][A-Za-z0-9 ./-]{0,19}$/.test(bar.trim())) errs.bar = t.lawyer.badFormat;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      await api(`/api/lawyer/${token}`, { body: { action: "identify", name, barNumber: bar } });
      setMessage("");
      await load();
    } catch (err) {
      fail(err);
    }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!docName.trim()) return setErrors({ docName: t.lawyer.required });
    setErrors({});
    try {
      await api(`/api/lawyer/${token}`, { body: { action: "add", name: docName, notes: docNotes, kind } });
      setDocName("");
      setDocNotes("");
      setMessage(t.lawyer.added);
      await load();
    } catch (err) {
      fail(err);
    }
  }

  return (
    <div lang={lang}>
      <h1>{t.lawyer.title}</h1>
      <p>{t.lawyer.intro}</p>
      <Note icon="info">
        <p>{t.lawyer.privacy}</p>
      </Note>
      <dl className="card facts">
        <dt>{t.lawyer.procedure}</dt>
        <dd>{procedure ? t1(procedure.name, lang) : "-"}</dd>
        <dt>{t.lawyer.court}</dt>
        <dd>{court ? t1(court.name, lang) : "-"}</dd>
      </dl>
      <p className="muted small">{fmt(t.lawyer.expires, { date: formatDateTime(data.expiresAt, lang) })}</p>

      {!data.lawyer ? (
        <form onSubmit={identify} noValidate>
          <TextField id="l-name" label={t.lawyer.name} value={name} onChange={setName} error={errors.name} maxLength={120} autoComplete="name" />
          <TextField id="l-bar" label={t.lawyer.bar} hint={t.lawyer.barHint} value={bar} onChange={setBar} error={errors.bar} maxLength={20} />
          <p className="muted small">{t.lawyer.notVerified}</p>
          <button type="submit" className="btn btn-primary btn-block">
            {t.lawyer.continue}
          </button>
        </form>
      ) : (
        <>
          <p>
            <strong>{fmt(t.docs.byWho, { name: data.lawyer.name, bar: data.lawyer.barNumber })}</strong>
          </p>
          <form onSubmit={add} noValidate className="card">
            <h2 style={{ marginTop: 0 }}>{t.lawyer.addTitle}</h2>
            <TextField id="d-name" label={t.lawyer.docName} value={docName} onChange={setDocName} error={errors.docName} maxLength={120} />
            <TextField id="d-notes" label={t.lawyer.docNotes} value={docNotes} onChange={setDocNotes} maxLength={500} multiline />
            <fieldset>
              <legend>{t.lawyer.kind}</legend>
              <ul className="choice-list">
                {(["bring", "receive"] as const).map((k) => (
                  <li key={k}>
                    <label className="choice">
                      <input type="radio" name="kind" checked={kind === k} onChange={() => setKind(k)} />
                      <span>{k === "bring" ? t.lawyer.kindBring : t.lawyer.kindReceive}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
            <button type="submit" className="btn btn-primary btn-block">
              {t.lawyer.add}
            </button>
          </form>

          {data.documents.length > 0 && (
            <>
              <h2>{t.lawyer.yours}</h2>
              <ul className="doc-list">
                {data.documents.map((d) => (
                  <li key={d.id} className="doc">
                    <span>
                      <strong>{d.name}</strong> <span className="small">({d.kind === "bring" ? t.lawyer.kindBring : t.lawyer.kindReceive})</span>
                      {d.notes && (
                        <span className="small" style={{ display: "block" }}>
                          {d.notes}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
      <p role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
