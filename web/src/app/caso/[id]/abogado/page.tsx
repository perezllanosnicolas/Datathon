"use client";

import Link from "next/link";
import { use, useState } from "react";
import { api } from "@/lib/api";
import { ClientOnly, fmt, usePrefs } from "@/components/PrefsProvider";
import { formatDateTime, Note } from "@/components/ui";
import { useCase } from "@/components/useCase";

// Invite my lawyer (AppFlow §2.2b). The person shares the link; the app sends nothing.
export default function InvitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <ClientOnly fallback={<p>…</p>}>
      <Invite id={id} />
    </ClientOnly>
  );
}

function Invite({ id }: { id: string }) {
  const { t, prefs } = usePrefs();
  const { loading, stored, data, reload } = useCase(id);
  const [fresh, setFresh] = useState<{ url: string; expiresAt: string } | null>(null);
  const [message, setMessage] = useState("");
  const [now] = useState(() => Date.now());

  if (loading) return <p>…</p>;
  if (!stored) {
    return (
      <>
        <h1>{t.flow.caseNotFound}</h1>
        <Link className="btn btn-primary" href="/elegir">
          {t.home.newCase}
        </Link>
      </>
    );
  }

  const active = data?.links.find((l) => !l.revokedAt && Date.parse(l.expiresAt) > now);

  async function create() {
    setMessage("");
    try {
      const r = await api<{ token: string; expiresAt: string }>(`/api/cases/${id}/links`, { secret: stored!.secret, body: { language: prefs.lang } });
      setFresh({ url: `${window.location.origin}/abogado/${r.token}`, expiresAt: r.expiresAt });
      await reload();
    } catch {
      setMessage(t.errors.network);
    }
  }

  async function revoke(linkId: string) {
    try {
      await api(`/api/cases/${id}/links/${linkId}`, { method: "DELETE", secret: stored!.secret });
      setFresh(null);
      setMessage(t.invite.revoked);
      await reload();
    } catch {
      setMessage(t.errors.generic);
    }
  }

  async function copy() {
    if (!fresh) return;
    try {
      await navigator.clipboard.writeText(fresh.url);
      setMessage(t.invite.copied);
    } catch {
      // Clipboard API needs HTTPS on some phones; the link stays visible to copy by hand.
      setMessage(fresh.url);
    }
  }

  async function share() {
    if (!fresh) return;
    try {
      await navigator.share({ title: t.invite.link, url: fresh.url });
    } catch {}
  }

  return (
    <>
      <h1>{t.invite.title}</h1>
      <Note icon="info">
        <p>{t.invite.can}</p>
        <p>{t.invite.cannot}</p>
      </Note>

      {fresh && (
        <section className="card" aria-labelledby="link-title">
          <h2 id="link-title" style={{ marginTop: 0 }}>
            {t.invite.link}
          </h2>
          <p className="link-box">{fresh.url}</p>
          <p>{fmt(t.invite.validUntil, { date: formatDateTime(fresh.expiresAt, prefs.lang) })}</p>
          <p className="muted small">{t.invite.onlyOnce}</p>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={copy}>
              {t.invite.copy}
            </button>
            {typeof navigator !== "undefined" && "share" in navigator && (
              <button type="button" className="btn" onClick={share}>
                {t.invite.share}
              </button>
            )}
          </div>
        </section>
      )}

      {active && (
        <section className="card" aria-labelledby="active-title">
          <h2 id="active-title" style={{ marginTop: 0 }}>
            {t.invite.active}
          </h2>
          <p>{fmt(t.invite.validUntil, { date: formatDateTime(active.expiresAt, prefs.lang) })}</p>
          {active.lawyerName && (
            <p className="small">
              {fmt(t.docs.byWho, { name: active.lawyerName, bar: active.lawyerBarNumber ?? "" })}
              <br />
              <span className="muted">{t.docs.notVerified}</span>
            </p>
          )}
          <button type="button" className="btn btn-danger" onClick={() => revoke(active.id)}>
            {t.invite.revoke}
          </button>
        </section>
      )}

      {!active && (
        <button type="button" className="btn btn-primary btn-block" onClick={create}>
          {data?.links.length ? t.invite.createAnother : t.invite.create}
        </button>
      )}

      <p role="status" aria-live="polite">
        {message}
      </p>
      <p className="muted small">{t.invite.localNote}</p>
      <p>
        <Link href={`/caso/${id}`}>{t.summary.back}</Link>
      </p>
    </>
  );
}
