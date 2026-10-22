"use client";

import { appendText, DictateButton } from "./Dictation";

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  error?: string;
  multiline?: boolean;
  type?: "text" | "search";
  maxLength?: number;
  autoComplete?: string;
}

/** Label above, field, optional hint and error, and the dictation button beside the field. */
export function TextField({ id, label, value, onChange, hint, error, multiline, type = "text", maxLength, autoComplete = "off" }: Props) {
  const described = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    value,
    maxLength,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": described,
  };
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {hint && (
        <p className="hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      <div className="input-row">
        {multiline ? (
          <textarea {...common} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input {...common} type={type} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
        )}
        <DictateButton field={label} onText={(heard) => onChange(appendText(value, heard))} />
      </div>
      {error && (
        <p className="field-error" id={`${id}-err`}>
          {error}
        </p>
      )}
    </div>
  );
}
