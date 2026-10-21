"use client";

import { PHASES, phaseOf, t1, type Step } from "@/lib/catalog";
import { fmt, usePrefs } from "./PrefsProvider";

export type StepStatus = "done" | "current" | "pending" | "skipped";

interface Props {
  steps: Step[];
  current: number;
  statusOf: (i: number) => StepStatus;
  listOpen: boolean;
  onToggleList: () => void;
  onGoTo: (i: number) => void;
}

// Progress bar (AppFlow §2.3b, UI/UX §6): text first, the bar only supports it.
// Text and bar stay fixed while scrolling; phases and the step list scroll with the page.
export function ProgressBar({ steps, current, statusOf, listOpen, onToggleList, onGoTo }: Props) {
  const { t, prefs } = usePrefs();
  const total = steps.length;
  const done = steps.filter((_, i) => statusOf(i) === "done").length;
  const skipped = steps.filter((_, i) => statusOf(i) === "skipped").length;
  const left = total - done - skipped;
  const currentPhase = phaseOf(steps[current].kind);
  const label = `${fmt(t.flow.progress, { n: current + 1, total })}. ${fmt(t.flow.doneLeft, { done, left })}`;

  return (
    <>
      <div className="progress-sticky">
        <p className="progress-text">
          {fmt(t.flow.progress, { n: current + 1, total })} <span className="progress-sub">· {fmt(t.flow.doneLeft, { done, left })}</span>
        </p>
        <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} aria-valuetext={label} aria-label={label}>
          {steps.map((s, i) => (
            <span key={s.id} className="progress-seg" data-state={statusOf(i)} />
          ))}
        </div>
      </div>
      <div className="progress">
        <ol className="phases" aria-label={t.flow.listTitle}>
          {PHASES.filter((ph) => steps.some((s) => phaseOf(s.kind) === ph)).map((ph) => {
            const inPhase = steps.filter((s) => phaseOf(s.kind) === ph).length;
            return (
              <li key={ph} className="phase" aria-current={ph === currentPhase ? "step" : undefined}>
                {t.flow[`phase_${ph}`]} ({inPhase})
              </li>
            );
          })}
        </ol>
        <button type="button" className="btn btn-quiet btn-block" aria-expanded={listOpen} aria-controls="step-list" onClick={onToggleList}>
          {listOpen ? t.flow.closeList : t.flow.openList}
        </button>
        {listOpen && (
          <ol id="step-list" className="step-list" style={{ marginTop: "0.5rem" }}>
            {steps.map((s, i) => {
              const st = statusOf(i);
              return (
                <li key={s.id}>
                  <button type="button" className="btn btn-quiet step-link" aria-current={i === current ? "step" : undefined} onClick={() => onGoTo(i)}>
                    <span>
                      {i + 1}. {t1(s.title, prefs.lang)}
                    </span>
                    <span className="step-status">{t.flow[`status_${st}`]}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </>
  );
}
