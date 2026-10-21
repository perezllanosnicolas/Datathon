"use client";

import { useEffect, useState } from "react";
import { tr, type Court } from "@/lib/catalog";
import { usePrefs } from "./PrefsProvider";
import { Icon } from "./ui";

// Facade of the court (AppFlow §2.4, TRD §3): one still image + a full text alternative.
// The text is always there; the image is optional and never the only source of information.
export function Facade({ court }: { court: Court }) {
  const { t, prefs } = usePrefs();
  const [meta, setMeta] = useState<{ available: boolean; date: string | null } | null>(null);
  const [imgFailed, setImgFailed] = useState(false);
  const [textOnly, setTextOnly] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/facade/${court.id}?meta=1`)
      .then((r) => r.json())
      .then((m) => alive && setMeta({ available: Boolean(m.available), date: m.date ?? null }))
      .catch(() => alive && setMeta({ available: false, date: null }));
    return () => {
      alive = false;
    };
  }, [court.id]);

  const e = court.entrance;
  const desc = tr(e.textDescription, prefs.lang);
  const access = tr(e.access, prefs.lang);
  const dropOff = tr(e.dropOff, prefs.lang);
  const showImage = meta?.available && !imgFailed && !textOnly;

  return (
    <section className="card" aria-labelledby="facade-title">
      <h2 id="facade-title" style={{ marginTop: 0 }}>
        <Icon name="place" /> {t.facade.title}
      </h2>

      {showImage && (
        <figure style={{ margin: "0 0 1rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- proxied Street View image, not optimisable */}
          <img
            className="facade-img"
            src={`/api/facade/${court.id}`}
            alt={`${t.facade.altPrefix} ${desc.text} ${access.text}`}
            width={640}
            height={400}
            onError={() => setImgFailed(true)}
          />
          <figcaption className="facade-meta">
            {t.facade.attribution}
            {meta?.date ? ` · ${meta.date}` : ""}
          </figcaption>
        </figure>
      )}
      {meta && !meta.available && <p className="muted">{t.facade.noImage}</p>}

      <dl className="facts" style={{ gridTemplateColumns: "1fr" }}>
        <dt>{t.facade.description}</dt>
        <dd lang={desc.fallback ? "es" : undefined}>{desc.text}</dd>
        <dt>{t.facade.road}</dt>
        <dd>{t.facade[`road_${e.roadDirection}`]}</dd>
        <dt>{t.facade.access}</dt>
        <dd lang={access.fallback ? "es" : undefined}>{access.text}</dd>
        <dt>{t.facade.dropOff}</dt>
        <dd lang={dropOff.fallback ? "es" : undefined}>{dropOff.text}</dd>
      </dl>
      <p className="muted small">{court.address}</p>
      {court.reviewStatus === "draft" && <p className="muted small">{t.facade.synthetic}</p>}

      {meta?.available && !imgFailed && (
        <button type="button" className="btn btn-quiet" onClick={() => setTextOnly(!textOnly)} aria-pressed={textOnly}>
          {textOnly ? t.facade.showImage : t.facade.showText}
        </button>
      )}
    </section>
  );
}
