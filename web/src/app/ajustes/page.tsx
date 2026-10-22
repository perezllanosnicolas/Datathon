"use client";

import { useRouter } from "next/navigation";
import { usePrefs } from "@/components/PrefsProvider";
import { ExtrasField, FontField, ImagesField, LanguageField, NeedsField } from "@/components/SettingsFields";
import { Note } from "@/components/ui";
import { clearAll } from "@/lib/storage";

export default function Settings() {
  const { t } = usePrefs();
  const router = useRouter();
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
      <div className="btn-stack">
        <button type="button" className="btn btn-primary btn-block" onClick={() => router.push("/")}>
          {t.settings.save}
        </button>
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
