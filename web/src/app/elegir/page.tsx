"use client";

import Link from "next/link";
import { usePrefs } from "@/components/PrefsProvider";
import { Icon } from "@/components/ui";

export default function Choose() {
  const { t } = usePrefs();
  return (
    <>
      <h1>{t.choose.title}</h1>
      <p>{t.choose.intro}</p>
      <ul className="result-list">
        <li className="card">
          <h2 style={{ marginTop: 0 }}>{t.choose.search}</h2>
          <p>{t.choose.searchDesc}</p>
          <Link className="btn btn-primary btn-block" href="/buscar">
            {t.choose.search}
          </Link>
        </li>
        <li className="card">
          <h2 style={{ marginTop: 0 }}>{t.choose.citation}</h2>
          <p>{t.choose.citationDesc}</p>
          <Link className="btn btn-block" href="/citacion">
            <Icon name="doc" />
            {t.choose.citation}
          </Link>
        </li>
      </ul>
    </>
  );
}
