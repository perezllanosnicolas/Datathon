"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { usePrefs } from "@/components/PrefsProvider";
import { ExtrasField, FontField, ImagesField, LanguageField, NeedsField } from "@/components/SettingsFields";
import { Note } from "@/components/ui";
import { clearAll, exportAll, importAll } from "@/lib/storage";

export default function Settings() {
  const { t } = usePrefs();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function download() {
    const blob = new Blob([exportAll()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mis-ajustes-juzgado.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function upload(file: File) {
    setMessage(importAll(await file.text()) ? t.settings.saved : t.settings.importError);
  }

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
        <NeedsField legend={t.quiz.needsQuestion} />
        <ExtrasField legend={t.quiz.otherOptions} />
      </form>
      <p role="status" aria-live="polite">
        {message}
      </p>

      <h2>{t.settings.export}</h2>
      <p className="muted">{t.settings.lossWarning}</p>
      <div className="btn-stack">
        <button type="button" className="btn btn-block" onClick={download}>
          {t.settings.export}
        </button>
        <button type="button" className="btn btn-block" onClick={() => fileRef.current?.click()}>
          {t.settings.import}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
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
