"use client";

import Link from "next/link";
import { usePrefs } from "./PrefsProvider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = usePrefs();
  return (
    <>
      <a className="skip-link" href="#main">
        {t.app.skipToContent}
      </a>
      <header className="site-header">
        <div className="wrap header-row">
          <Link href="/" className="brand">
            {t.app.name}
          </Link>
          <nav aria-label={t.app.name}>
            <ul className="header-nav">
              <li>
                <Link href="/glosario">{t.app.glossary}</Link>
              </li>
              <li>
                <Link href="/ajustes">{t.app.settings}</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" className="wrap" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="wrap">
          <p>{t.app.disclaimer}</p>
          <p className="muted">{t.app.demoNotice}</p>
        </div>
      </footer>
    </>
  );
}
