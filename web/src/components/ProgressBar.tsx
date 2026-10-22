"use client";

import { PHASES, phaseOf, type Step } from "@/lib/catalog";
import { fmt, usePrefs } from "./PrefsProvider";

export type StepStatus = "done" | "current" | "pending" | "skipped";

interface Props {
  steps: Step[];
  current: number;
  statusOf: (i: number) => StepStatus;
}

// Progress bar (AppFlow §2.3b, UI/UX §6): text first, the bar only supports it.
// Text and bar stay fixed while scrolling; the phases and the link to the map scroll away.
export function ProgressBar({ steps, current, statusOf }: Props) {
  const { t } = usePrefs();
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
        <ol className="phases" aria-label={t.map.title}>
          {PHASES.filter((ph) => steps.some((s) => phaseOf(s.kind) === ph)).map((ph) => (
            <li key={ph} className="phase" aria-current={ph === currentPhase ? "step" : undefined}>
              {t.flow[`phase_${ph}`]}
            </li>
          ))}
        </ol>
        <a className="map-link" href="#mapa">
          {t.flow.openList}
        </a>
      </div>
    </>
  );
}
