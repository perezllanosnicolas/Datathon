// Step and document images. Pictograms come from ARASAAC (downloaded into /public by
// `npm run pictos`); realistic images are real photos placed in public/images/realistic/ (or generated with baoyu-image-gen, `data/realistic/`).
import pictograms from "../../data/catalog/pictograms.json";
import realisticList from "../../data/realistic/available.json";
import type { Lang } from "./catalog";

const steps = pictograms.steps as Record<string, number>;
const documents = pictograms.documents as Record<string, number>;
const extras = pictograms.extras as Record<string, number>;
const realistic = realisticList as string[];

const pictoUrl = (id: number | undefined) => (id ? `/pictos/arasaac/${id}.png` : null);

export const pictoForStep = (slot: string) => pictoUrl(steps[slot]);
export const pictoForDoc = (docId: string) => pictoUrl(documents[docId]);
export const pictoExtra = (name: string) => pictoUrl(extras[name]);

/** Realistic images exist only for the steps listed by scripts/list-realistic.mjs (file names); others fall back to the pictogram. */
export const realForStep = (slot: string) => {
  const file = realistic.find((f) => f.replace(/\.[a-z]+$/, "") === slot);
  return file ? `/images/realistic/${file}` : null;
};

export function pictoAttribution(lang: Lang): string {
  const a = pictograms.attribution as Record<Lang, string>;
  return a[lang] ?? a.es;
}
