"use client";

import { useState } from "react";
import { tr, type DocKind, type StepDocument } from "@/lib/catalog";
import { api, type CaseDocument } from "@/lib/api";
import { fmt, usePrefs } from "./PrefsProvider";
import { Icon } from "./ui";

interface Props {
  kind: DocKind;
  catalogDocs: StepDocument[];
  lawyerDocs: CaseDocument[];
  checked: string[];
  onToggle: (id: string) => void;
  caseId: string;
  secret?: string;
  onChanged: () => void;
}

/** Bring / receive list. Lawyer documents are shown apart and labelled with text, not colour. */
export function Documents({ kind, catalogDocs, lawyerDocs, checked, onToggle, caseId, secret, onChanged }: Props) {
  const { t, prefs } = usePrefs();
  const title = kind === "bring" ? t.flow.bring : t.flow.receive;
  const lawyer = lawyerDocs.filter((d) => d.kind === kind && d.status !== "rejected");
  if (!catalogDocs.length && !lawyer.length) return null;

  return (
    <section aria-label={title}>
      <h2>
        <Icon name="doc" /> {title}
      </h2>
      <ul className="doc-list">
        {catalogDocs.map((d) => {
          const name = tr(d.name, prefs.lang);
          const notes = tr(d.notes, prefs.lang);
          const id = `doc-${d.id}`;
          return (
            <li key={d.id}>
              <label className="doc" htmlFor={id}>
                <input id={id} type="checkbox" checked={checked.includes(d.id)} onChange={() => onToggle(d.id)} />
                <span>
                  <strong lang={name.fallback ? "es" : undefined}>{name.text}</strong>
                  {notes.text && (
                    <span className="small" style={{ display: "block" }} lang={notes.fallback ? "es" : undefined}>
                      {notes.text}
                    </span>
                  )}
                </span>
              </label>
            </li>
          );
        })}
        {lawyer.map((d) => (
          <LawyerDoc key={d.id} doc={d} checked={checked.includes(d.id)} onToggle={() => onToggle(d.id)} caseId={caseId} secret={secret} onChanged={onChanged} />
        ))}
      </ul>
    </section>
  );
}

function LawyerDoc({ doc, checked, onToggle, caseId, secret, onChanged }: { doc: CaseDocument; checked: boolean; onToggle: () => void; caseId: string; secret?: string; onChanged: () => void }) {
  const { t } = usePrefs();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(doc.name);
  const [notes, setNotes] = useState(doc.notes ?? "");
  const [error, setError] = useState("");

  async function act(action: "accept" | "reject" | "edit") {
    setError("");
    try {
      await api(`/api/cases/${caseId}/documents/${doc.id}`, { method: "PATCH", secret, body: action === "edit" ? { action, name, notes } : { action } });
      setEditing(false);
      onChanged();
    } catch {
      setError(t.errors.generic);
    }
  }

  const id = `doc-${doc.id}`;
  return (
    <li className="doc doc-lawyer" style={{ flexDirection: "column" }}>
      <p className="tag">{t.docs.addedByLawyer}</p>
      {editing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            act("edit");
          }}
          style={{ width: "100%" }}
        >
          <div className="field">
            <label htmlFor={`${id}-name`}>{t.docs.name}</label>
            <input id={`${id}-name`} type="text" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
          </div>
          <div className="field">
            <label htmlFor={`${id}-notes`}>{t.docs.notes}</label>
            <textarea id={`${id}-notes`} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} />
          </div>
          <div className="btn-row">
            <button type="button" className="btn btn-quiet" onClick={() => setEditing(false)}>
              {t.docs.cancel}
            </button>
            <button type="submit" className="btn btn-primary">
              {t.docs.save}
            </button>
          </div>
        </form>
      ) : (
        <>
          <label htmlFor={id} style={{ display: "flex", gap: "0.6rem", fontWeight: 400 }}>
            <input id={id} type="checkbox" checked={checked} onChange={onToggle} />
            <span>
              <strong>{doc.name}</strong>
              {doc.notes && (
                <span className="small" style={{ display: "block" }}>
                  {doc.notes}
                </span>
              )}
            </span>
          </label>
          {doc.lawyer?.name && (
            <p className="small" style={{ margin: "0.4rem 0 0" }}>
              {fmt(t.docs.byWho, { name: doc.lawyer.name, bar: doc.lawyer.barNumber ?? "" })}
              <br />
              <span className="muted">{t.docs.notVerified}</span>
            </p>
          )}
          <div className="btn-row" style={{ width: "100%", margin: "0.5rem 0 0" }}>
            {doc.status === "pending" ? (
              <button type="button" className="btn" onClick={() => act("accept")}>
                {t.docs.accept}
              </button>
            ) : (
              <span className="small" style={{ alignSelf: "center" }}>
                {t.docs.accepted}
              </span>
            )}
            <button type="button" className="btn btn-quiet" onClick={() => setEditing(true)}>
              {t.docs.edit}
            </button>
            <button type="button" className="btn btn-danger" onClick={() => act("reject")}>
              {t.docs.remove}
            </button>
          </div>
        </>
      )}
      {error && <p className="field-error">{error}</p>}
    </li>
  );
}
