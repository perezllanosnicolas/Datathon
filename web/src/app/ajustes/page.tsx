"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrefs } from "@/components/PrefsProvider";
import { ExtrasField, FontField, ImagesField, LanguageField, NeedsField } from "@/components/SettingsFields";
import { Note } from "@/components/ui";
import { clearAll, getPrefsSnapshot, savePrefs } from "@/lib/storage";

export default function Settings() {
  const { t } = usePrefs();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  return (
    <>
      <h1>{t.settings.title}</h1>
      <Note icon="info">
        <p>{t.settings.privacy}</p>
      </Note>
      <form onSubmit={(e) => e.preventDefault()}>
        <LanguageField legend={t.quiz.langQuestion} />
        <FontField legend={t.quiz.fontQuestion} />
        <ImagesField legend={t.quiz.imagesQuestion} />
        <ExtrasField legend={t.quiz.adaptQuestion} />
        <NeedsField legend={t.quiz.needsQuestion} />
      </form>
      <div className="btn-stack save-bar">
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => {
            savePrefs(getPrefsSnapshot());
            setSaved(true);
          }}
        >
          {t.settings.save}
        </button>
        <p role="status" aria-live="polite">
          {saved ? t.settings.saved : ""}
        </p>
        <button
          type="button"
          className="btn btn-danger btn-block"
          onClick={() => {
            if (window.confirm(t.settings.resetConfirm)) {
              clearAll();
              router.push("/");
            }
          }}
        >
          {t.settings.reset}
        </button>
      </div>
    </>
  );
}
