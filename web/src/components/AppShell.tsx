"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import credits from "../../data/realistic/credits.json";
import { pictoAttribution } from "@/lib/images";
import { loadCases } from "@/lib/storage";
import { usePrefs } from "./PrefsProvider";
import { Icon, type IconName } from "./ui";

/** The product's mark: three steps going up to a door, drawn in ink. */
function Mark() {
  return (
    <svg className="mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="30" height="30" rx="7" fill="currentColor" />
      <path d="M7 24h5v-4h5v-4h5V8h3" fill="none" stroke="var(--surface)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const noop = () => () => {};
/** The latest case on this device, read after hydration (server: none). */
function useLatestCaseHref(): string {
  return useSyncExternalStore(
    noop,
    () => {
      const c = loadCases()[0];
      return c ? `/caso/${c.id}` : "/elegir";
    },
    () => "/elegir",
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t, prefs } = usePrefs();
  const pathname = usePathname();
  const caseHref = useLatestCaseHref();

  const nav: { href: string; label: string; icon: IconName; match: (p: string) => boolean }[] = [
    { href: "/", label: t.app.home, icon: "home", match: (p) => p === "/" },
    { href: caseHref, label: t.app.myCase, icon: "steps", match: (p) => p.startsWith("/caso") || ["/elegir", "/buscar", "/citacion", "/confirmar"].includes(p) },
    { href: "/glosario", label: t.app.glossary, icon: "book", match: (p) => p === "/glosario" },
    { href: "/ajustes", label: t.app.settings, icon: "sliders", match: (p) => p === "/ajustes" || p === "/cuestionario" },
  ];
  const isLawyer = pathname.startsWith("/abogado");

  return (
    <>
      <a className="skip-link" href="#main">
        {t.app.skipToContent}
      </a>
      <header className="site-header">
        <div className="wrap header-row">
          <Link href="/" className="brand">
            <Mark />
            <span>{t.app.name}</span>
          </Link>
          {!isLawyer && (
            <nav aria-label={t.app.name} className="top-nav">
              <ul>
                {nav.map((n) => (
                  <li key={n.label}>
                    <Link href={n.href} aria-current={n.match(pathname) ? "page" : undefined}>
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>
      <main id="main" className="wrap" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div className="footer-brand">
            <p className="footer-name">
              <Mark />
              <strong>{t.app.name}</strong>
            </p>
            <p>{t.app.subtitle}</p>
            <p>{t.app.org}</p>
            <p className="muted">{t.app.notOfficial}</p>
          </div>
          <ul className="footer-logos">
            <li>
              {/* eslint-disable-next-line @next/next/no-img-element -- static SVG */}
              <img src="/images/official/ministerio.jpg" alt={`${t.app.logoGov}. ${t.app.logoJustice}`} height={48} />
            </li>
            <li>
              {/* eslint-disable-next-line @next/next/no-img-element -- static SVG */}
              <img src="/images/official/urjc.svg" alt={t.app.logoUrjc} height={48} />
            </li>
            <li>
              {/* eslint-disable-next-line @next/next/no-img-element -- static image */}
              <img src="/images/official/udc.png" alt={t.app.logoUdc} height={48} />
            </li>
          </ul>
          <div className="footer-notes">
            <p>{t.app.disclaimer}</p>
            <p className="muted">{t.app.demoNotice}</p>
            {prefs.imageMode !== "none" && <p className="muted small">{pictoAttribution(prefs.lang)}</p>}
            {prefs.imageMode === "real" && (
              <details className="credits small muted">
                <summary>{t.app.photoCredits}</summary>
                <ul>
                  {credits.map((c) => (
                    <li key={c.slot}>
                      <a href={c.source}>{c.title}</a> · {c.creator} · {c.license} · Wikimedia Commons
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </div>
      </footer>
      {!isLawyer && (
        <nav aria-label={t.app.name} className="tab-bar">
          <ul>
            {nav.map((n) => (
              <li key={n.label}>
                <Link href={n.href} aria-current={n.match(pathname) ? "page" : undefined}>
                  <Icon name={n.icon} />
                  <span>{n.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
