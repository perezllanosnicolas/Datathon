"use client";

import {
  PHASES,
  phaseOf,
  tr,
  type Court,
  type Phase,
  type Step,
} from "@/lib/catalog";
import { fmt, usePrefs } from "./PrefsProvider";
import type { StepStatus } from "./ProgressBar";
import { StepImage } from "./StepImage";
import { Icon } from "./ui";

interface Props {
  steps: Step[];
  court?: Court;
  /** Index of the step the person is on; its phase opens by default. */
  current?: number;
  statusOf?: (i: number) => StepStatus;
  onGoTo?: (i: number) => void;
  /** Open every phase (summary) instead of only the current one. */
  openAll?: boolean;
  headingLevel?: 2 | 3;
  /** The whole map folds; it starts open only where the person sees it for the first time. */
  defaultOpen?: boolean;
}

/**
 * The procedure as a vertical flow diagram that folds like an accordion (AppFlow §2.3):
 * phases → steps → details. Native <details>, so it works with keyboard and screen readers
 * and opens without animation.
 */
export function FlowMap({
  steps,
  court,
  current,
  statusOf,
  onGoTo,
  openAll = false,
  headingLevel = 2,
  defaultOpen = false,
}: Props) {
  const { t, prefs } = usePrefs();
  const lang = prefs.lang;
  const H = headingLevel === 2 ? "h2" : "h3";
  const currentPhase: Phase | undefined =
    current !== undefined ? phaseOf(steps[current].kind) : undefined;
  const indexed = steps.map((s, i) => ({ s, i }));

  return (
    <section className="flowmap" aria-labelledby="flowmap-title" id="mapa">
      <details className="flowmap-toggle" open={defaultOpen || openAll}>
        <summary>
          <Icon name="steps" />
          <H
            id="flowmap-title"
            className="fm-toggle-title"
            style={{ margin: 0, fontSize: "inherit" }}
          >
            {t.map.title}
          </H>
          <Icon name="chevron" />
        </summary>
        <div className="flowmap-body">
          <p className="muted">{t.map.intro}</p>
          <ol className="fm-phases">
            {PHASES.map((ph) => {
              const items = indexed.filter(({ s }) => phaseOf(s.kind) === ph);
              if (!items.length) return null;
              const done = statusOf
                ? items.filter(({ i }) => statusOf(i) === "done").length
                : 0;
              return (
                <li
                  key={ph}
                  className="fm-phase"
                  data-current={ph === currentPhase || undefined}
                >
                  <details
                    open={
                      openAll ||
                      ph === currentPhase ||
                      (current === undefined && ph === "arrival")
                    }
                  >
                    <summary>
                      <span className="fm-phase-name">
                        {t.flow[`phase_${ph}`]}
                      </span>
                      <span className="fm-phase-meta">
                        {items.length === 1
                          ? t.map.step
                          : fmt(t.map.steps, { n: items.length })}
                        {statusOf
                          ? ` · ${fmt(t.map.doneOf, { done, n: items.length })}`
                          : ""}
                      </span>
                      <Icon name="chevron" />
                    </summary>
                    <ol className="fm-steps">
                      {items.map(({ s, i }) => {
                        const status = statusOf?.(i);
                        const title = tr(s.title, lang).text;
                        const expected = tr(s.expected, lang).text;
                        const where = court
                          ? tr(court.stepNotes[s.slot], lang).text
                          : undefined;
                        const bring = s.documents.filter(
                          (d) => d.kind === "bring",
                        );
                        const receive = s.documents.filter(
                          (d) => d.kind === "receive",
                        );
                        return (
                          <li
                            key={s.id}
                            className="fm-step"
                            data-state={status ?? "pending"}
                          >
                            <details>
                              <summary
                                aria-current={
                                  status === "current" ? "step" : undefined
                                }
                              >
                                <span className="fm-node" aria-hidden="true" />
                                <StepImage
                                  slot={s.slot}
                                  size="sm"
                                  caption={false}
                                />
                                <span className="fm-step-title">{title}</span>
                                {status && (
                                  <span className="fm-status">
                                    {status === "current"
                                      ? t.map.now
                                      : t.flow[`status_${status}`]}
                                  </span>
                                )}
                                <Icon name="chevron" />
                              </summary>
                              <div className="fm-body">
                                {expected && (
                                  <p className="expected">{expected}</p>
                                )}
                                <p className="small">
                                  <strong>{t.flow.duration}:</strong>{" "}
                                  {fmt(t.flow.durationRange, {
                                    a: s.durationMin[0],
                                    b: s.durationMin[1],
                                  })}
                                </p>
                                {where && (
                                  <p className="small">
                                    <strong>{t.flow.here}:</strong> {where}
                                  </p>
                                )}
                                {bring.length > 0 && (
                                  <>
                                    <p className="small fm-label">
                                      {t.flow.bring}
                                    </p>
                                    <ul className="small">
                                      {bring.map((d) => (
                                        <li key={d.id}>
                                          {tr(d.name, lang).text}
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                                {receive.length > 0 && (
                                  <>
                                    <p className="small fm-label">
                                      {t.flow.receive}
                                    </p>
                                    <ul className="small">
                                      {receive.map((d) => (
                                        <li key={d.id}>
                                          {tr(d.name, lang).text}
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                                {onGoTo && status !== "current" && (
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => onGoTo(i)}
                                  >
                                    {t.map.goTo}
                                  </button>
                                )}
                              </div>
                            </details>
                          </li>
                        );
                      })}
                    </ol>
                  </details>
                </li>
              );
            })}
          </ol>
        </div>
      </details>
    </section>
  );
}
