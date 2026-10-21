"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { phaseOf, tr, type Lang, type Step } from "@/lib/catalog";
import { loadProgress, loadSeenDocs, saveProgress, saveSeenDocs, type Progress } from "@/lib/storage";
import type { Messages } from "@/i18n/es";
import { ClientOnly, fmt, usePrefs } from "@/components/PrefsProvider";
import { ProgressBar, type StepStatus } from "@/components/ProgressBar";
import { Facade } from "@/components/Facade";
import { Documents } from "@/components/Documents";
import { Icon, Note, ReadAloud, type IconName } from "@/components/ui";
import { useCase } from "@/components/useCase";

function durationWords(t: Messages, max: number): string {
  if (max <= 15) return t.flow.durationWords;
  if (max <= 30) return t.flow.durationWordsHalf;
  if (max <= 60) return t.flow.durationWordsHour;
  return t.flow.durationWordsLong;
}

/** Steps where lawyer documents appear: bring → preparation step, receive → last step. */
function lawyerSlot(steps: Step[]) {
  const prep = steps.findIndex((s) => s.kind === "prepare");
  return { bring: prep >= 0 ? prep : 0, receive: steps.length - 1 };
}

export default function FlowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <ClientOnly fallback={<p>…</p>}>
      <Flow id={id} />
    </ClientOnly>
  );
}

function Flow({ id }: { id: string }) {
  const { t, prefs } = usePrefs();
  const router = useRouter();
  const { stored, procedure, court, data, reload } = useCase(id);
  const [progress, setProgress] = useState<Progress>(() => loadProgress(id));
  const [listOpen, setListOpen] = useState(false);
  const [seenAtOpen] = useState(() => loadSeenDocs(id));
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // In-app notice of new lawyer documents (no e-mail, decision 2026-10-21).
  const lawyerIds = data?.documents.filter((d) => d.addedBy === "lawyer" && d.status !== "rejected").map((d) => d.id) ?? [];
  const newDocs = lawyerIds.filter((x) => !seenAtOpen.includes(x)).length;
  const lawyerKey = lawyerIds.join(",");
  useEffect(() => {
    if (data) saveSeenDocs(id, lawyerKey ? lawyerKey.split(",") : []);
  }, [data, id, lawyerKey]);

  // Move focus to the step title on change so screen readers announce it.
  const stepIndex = progress.current;
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
  }, [stepIndex]);

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

  const steps = procedure.steps;
  const current = Math.min(progress.current, steps.length - 1);
  const step = steps[current];
  const lang: Lang = prefs.lang;
  const needs = prefs.needs;
  const lawyerDocs = data?.documents.filter((d) => d.addedBy === "lawyer") ?? [];
  const slots = lawyerSlot(steps);

  const statusOf = (i: number): StepStatus => {
    if (i === current) return "current";
    if (progress.done.includes(steps[i].id)) return "done";
    if (progress.skipped.includes(steps[i].id)) return "skipped";
    return "pending";
  };

  function update(p: Partial<Progress>) {
    const next = { ...progress, ...p };
    setProgress(next);
    saveProgress(id, next);
  }

  function goTo(i: number) {
    setListOpen(false);
    update({ current: i });
    window.scrollTo(0, 0);
  }

  function markDone() {
    const done = [...new Set([...progress.done, step.id])];
    const skipped = progress.skipped.filter((s) => s !== step.id);
    if (current === steps.length - 1) {
      update({ done, skipped });
      router.push(`/caso/${id}/resumen`);
    } else {
      update({ done, skipped, current: current + 1 });
      window.scrollTo(0, 0);
    }
  }

  function skip() {
    const skipped = [...new Set([...progress.skipped, step.id])];
    const done = progress.done.filter((s) => s !== step.id);
    if (current === steps.length - 1) {
      update({ done, skipped });
      router.push(`/caso/${id}/resumen`);
    } else {
      update({ done, skipped, current: current + 1 });
      window.scrollTo(0, 0);
    }
  }

  function toggleChecked(docId: string) {
    const checked = progress.checked ?? [];
    update({ checked: checked.includes(docId) ? checked.filter((x) => x !== docId) : [...checked, docId] });
  }

  // Localised fields; if any fell back to Spanish the step says so.
  const f = {
    title: tr(step.title, lang),
    expected: tr(step.expected, lang),
    instructions: tr(step.instructions, lang),
    sensory: tr(step.sensory, lang),
    calm: tr(step.calmTip, lang),
    phrase: tr(step.protocolPhrase, lang),
    who: tr(step.whoToAsk, lang),
    legal: tr(step.legalNote, lang),
    here: tr(court.stepNotes[step.slot], lang),
  };
  const fallback = Object.values(f).some((x) => x.fallback);
  const title = f.title.text ?? "";
  const expected = f.expected.text;
  const instructions = f.instructions.text ?? [];
  const sensory = f.sensory.text;
  const calm = f.calm.text;
  const phrase = f.phrase.text;
  const who = f.who.text;
  const legal = f.legal.text;
  const here = f.here.text;
  const [dMin, dMax] = step.durationMin;

  const allExtras: { key: string; icon: IconName; title: string; text?: string; tone?: "warn" | "ok" }[] = [
    { key: "phrase", icon: "speech", title: t.flow.phrase, text: phrase && `«${phrase}»` },
    { key: "calm", icon: "calm", title: t.flow.calm, text: calm, tone: "ok" },
    { key: "who", icon: "person", title: t.flow.whoToAsk, text: who },
    { key: "legal", icon: "scale", title: t.flow.legal, text: legal },
  ];
  const extras = allExtras.filter((x) => x.text);

  const sensoryNote = sensory ? (
    <Note icon="sound" title={t.flow.sensory} tone="warn">
      <p>{sensory}</p>
    </Note>
  ) : null;

  const extrasBlock = extras.map((x) => (
    <Note key={x.key} icon={x.icon} title={x.title} tone={x.tone}>
      <p>{x.text}</p>
    </Note>
  ));

  const speakText = [title, expected, ...instructions, sensory, phrase].filter(Boolean).join(". ");

  return (
    <>
      <ProgressBar steps={steps} current={current} statusOf={statusOf} listOpen={listOpen} onToggleList={() => setListOpen(!listOpen)} onGoTo={goTo} />

      <p className="sr-only" aria-live="polite">
        {fmt(t.flow.stepAnnounce, { n: current + 1, total: steps.length, title })}
      </p>

      {newDocs > 0 && (
        <Note tone="lawyer" icon="doc" title={newDocs === 1 ? t.docs.newDoc : fmt(t.docs.newDocs, { n: newDocs })}>
          <button type="button" className="btn" onClick={() => goTo(slots.bring)}>
            {t.flow.bring}
          </button>
        </Note>
      )}

      <article aria-labelledby="step-title" lang={fallback ? undefined : lang}>
        <header className="step-head">
          <p className="step-eyebrow">{t.flow[`phase_${phaseOf(step.kind)}`]}</p>
          <h1 id="step-title" ref={heading} tabIndex={-1}>
            {title}
          </h1>
          {expected && (
            <div className="card" style={{ borderColor: "var(--primary)" }}>
              <p className="muted small" style={{ margin: 0 }}>
                {t.flow.expected}
              </p>
              <p className="expected" style={{ margin: 0 }}>
                {expected}
              </p>
            </div>
          )}
          <p>
            <Icon name="clock" /> <strong>{t.flow.duration}:</strong> {fmt(t.flow.durationRange, { a: dMin, b: dMax })}
          </p>
          {needs.includes("discalculia") && (
            <>
              <p className="small">{durationWords(t, dMax)}</p>
              <div className="duration-bar" aria-hidden="true">
                <span style={{ width: `${Math.min((dMax / 90) * 100, 100)}%` }} />
              </div>
            </>
          )}
          <ReadAloud text={speakText} />
        </header>

        {needs.includes("tea") && sensoryNote}

        <h2>{t.flow.whatToDo}</h2>
        <ol>
          {instructions.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
        {here && (
          <Note icon="place" title={t.flow.here}>
            <p>{here}</p>
          </Note>
        )}

        {!needs.includes("tea") && sensoryNote}

        {step.showsEntrance && <Facade court={court} />}

        <Documents
          kind="bring"
          catalogDocs={step.documents.filter((d) => d.kind === "bring")}
          lawyerDocs={current === slots.bring ? lawyerDocs : []}
          checked={progress.checked ?? []}
          onToggle={toggleChecked}
          caseId={id}
          secret={stored.secret}
          onChanged={reload}
        />
        <Documents
          kind="receive"
          catalogDocs={step.documents.filter((d) => d.kind === "receive")}
          lawyerDocs={current === slots.receive ? lawyerDocs : []}
          checked={progress.checked ?? []}
          onToggle={toggleChecked}
          caseId={id}
          secret={stored.secret}
          onChanged={reload}
        />

        {current === slots.bring && (
          <p>
            <Link className="btn btn-block" href={`/caso/${id}/abogado`}>
              <Icon name="person" />
              {t.invite.open}
            </Link>
          </p>
        )}

        {extras.length > 0 &&
          (needs.includes("tdah") ? (
            <details className="card">
              <summary style={{ cursor: "pointer", minHeight: 44, display: "flex", alignItems: "center", fontWeight: 600 }}>{t.flow.more}</summary>
              <div style={{ marginTop: "0.75rem" }}>{extrasBlock}</div>
            </details>
          ) : (
            extrasBlock
          ))}

        {fallback && <p className="muted small">{t.flow.fallbackLang}</p>}
      </article>

      <nav className="btn-row" aria-label={t.flow.listTitle}>
        <button type="button" className="btn" onClick={() => goTo(current - 1)} disabled={current === 0}>
          {t.flow.prev}
        </button>
        <button type="button" className="btn btn-primary" onClick={markDone}>
          {current === steps.length - 1 ? t.flow.finish : t.flow.next}
        </button>
      </nav>
      <div className="btn-row">
        <button type="button" className="btn btn-quiet" onClick={() => heading.current?.focus()}>
          {t.flow.repeat}
        </button>
        <button type="button" className="btn btn-quiet" onClick={skip}>
          {t.flow.skip}
        </button>
      </div>
      <p>
        <Link href={`/caso/${id}/resumen`}>{t.flow.summary}</Link>
      </p>
      {procedure.reviewStatus === "draft" && <p className="muted small">{t.flow.draft}</p>}
    </>
  );
}
