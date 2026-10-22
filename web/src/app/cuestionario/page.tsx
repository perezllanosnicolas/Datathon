"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { fmt, usePrefs } from "@/components/PrefsProvider";
import { ExtrasField, FontField, ImagesField, LanguageField, NeedsField } from "@/components/SettingsFields";

// Adaptation questionnaire (AppFlow §2.1): one question per screen, no account, no diagnosis.
export default function Questionnaire() {
  const { t, setPrefs } = usePrefs();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const total = 4;

  useEffect(() => heading.current?.focus(), [step]);

  function next() {
    if (step < total - 1) setStep(step + 1);
    else {
      setPrefs({ onboarded: true });
      router.push("/elegir");
    }
  }

  return (
    <>
      <h1 ref={heading} tabIndex={-1}>
        {t.quiz.title}
      </h1>
      <p className="lead">{fmt(t.quiz.questionOf, { n: step + 1, total })}</p>
      <div className="quiz-track" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} data-on={i <= step || undefined} />
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
      >
        {step === 0 && <LanguageField legend={t.quiz.langQuestion} />}
        {step === 1 && <FontField legend={t.quiz.fontQuestion} />}
        {step === 2 && <ImagesField legend={t.quiz.imagesQuestion} />}
        {step === 3 && (
          <>
            <NeedsField legend={t.quiz.needsQuestion} />
            <ExtrasField legend={t.quiz.otherOptions} />
          </>
        )}
        <div className="btn-row btn-row-end">
          {step > 0 && (
            <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)}>
              {t.quiz.back}
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {step < total - 1 ? t.quiz.next : t.quiz.finish}
          </button>
        </div>
      </form>
    </>
  );
}
