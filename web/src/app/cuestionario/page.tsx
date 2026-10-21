"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { fmt, usePrefs } from "@/components/PrefsProvider";
import { ExtrasField, FontField, LanguageField, NeedsField } from "@/components/SettingsFields";

// Adaptation questionnaire (AppFlow §2.1): one question per screen, no account, no diagnosis.
export default function Questionnaire() {
  const { t, setPrefs } = usePrefs();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const total = 3;

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
      <p className="step-eyebrow">{fmt(t.quiz.questionOf, { n: step + 1, total })}</p>
      <h1 ref={heading} tabIndex={-1}>
        {t.quiz.title}
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
      >
        {step === 0 && <LanguageField legend={t.quiz.langQuestion} />}
        {step === 1 && <FontField legend={t.quiz.fontQuestion} />}
        {step === 2 && (
          <>
            <NeedsField legend={t.quiz.needsQuestion} />
            <ExtrasField legend={t.quiz.otherOptions} />
          </>
        )}
        <div className="btn-row">
          {step > 0 && (
            <button type="button" className="btn" onClick={() => setStep(step - 1)}>
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
