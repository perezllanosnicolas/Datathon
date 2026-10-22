"use client";

import { useState } from "react";
import { pictoForStep, realForStep } from "@/lib/images";
import type { ImageMode } from "@/lib/storage";
import { usePrefs } from "./PrefsProvider";

interface Props {
  slot: string;
  size?: "lg" | "sm";
  /** Force a mode (used by the questionnaire previews). Defaults to the person's choice. */
  mode?: ImageMode;
  /** Show the "generated image" / "missing" note under large images. */
  caption?: boolean;
}

/**
 * The picture of a step, in the mode the person chose. It is decorative (alt=""): the step's
 * text always says the same, so a screen reader does not read it twice.
 */
export function StepImage({ slot, size = "lg", mode, caption = size === "lg" }: Props) {
  const { prefs, t } = usePrefs();
  const chosen = mode ?? prefs.imageMode;
  const [realFailed, setRealFailed] = useState(false);
  const picto = pictoForStep(slot);
  const real = realForStep(slot);

  if (chosen === "none") return null;
  const useReal = chosen === "real" && real && !realFailed;
  const src = useReal ? real : picto;
  if (!src) return null;

  return (
    <figure className={`step-img step-img-${size}${useReal ? " is-real" : " is-picto"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- small static files, already sized */}
      <img
        src={src}
        alt=""
        width={size === "lg" ? 320 : 56}
        height={size === "lg" ? 320 : 56}
        loading={size === "sm" ? "lazy" : undefined}
        decoding="async"
        onError={() => useReal && setRealFailed(true)}
      />
      {caption && chosen === "real" && <figcaption className="small muted">{useReal ? t.images.realNote : t.images.realMissing}</figcaption>}
    </figure>
  );
}
