// Catalog of procedures, courts and glossary terms.
// Content lives as data in /data/catalog (reviewed by the Law team), not in code.
import proceduresData from "../../data/catalog/procedures.json";
import courtsData from "../../data/catalog/courts.json";
import glossaryData from "../../data/catalog/glossary.json";

export const LANGUAGES = ["es", "ca", "eu", "gl"] as const;
export type Lang = (typeof LANGUAGES)[number];

/** Text in up to four languages. Spanish is always present and is the fallback. */
export type LText = { es: string } & Partial<Record<Exclude<Lang, "es">, string>>;
export type LList = { es: string[] } & Partial<Record<Exclude<Lang, "es">, string[]>>;

export type DocKind = "bring" | "receive";
export type StepKind = "prepare" | "arrival" | "access" | "wait" | "procedure" | "exit";
export type Phase = "arrival" | "wait" | "procedure" | "exit";

export interface StepDocument {
  id: string;
  kind: DocKind;
  name: LText;
  notes?: LText;
}

export interface Step {
  id: string;
  slot: string;
  kind: StepKind;
  showsEntrance?: boolean;
  durationMin: [number, number];
  title: LText;
  expected: LText;
  instructions: LList;
  sensory?: LText;
  calmTip?: LText;
  protocolPhrase?: LText;
  whoToAsk?: LText;
  legalNote?: LText;
  documents: StepDocument[];
}

export interface Procedure {
  id: string;
  processType: string;
  reviewStatus: "draft" | "reviewed";
  name: LText;
  summary: LText;
  legalBasis: LText;
  searchTerms: Partial<Record<Lang, string[]>>;
  steps: Step[];
}

export interface Court {
  id: string;
  reviewStatus: "draft" | "reviewed";
  processTypes: string[];
  city: string;
  name: LText;
  address: string;
  searchTerms: string[];
  entrance: {
    streetView: { location: string; heading?: number; pitch?: number; fov?: number };
    roadDirection: "one_way" | "two_way" | "pedestrian" | "other";
    dropOff: LText;
    access: LText;
    textDescription: LText;
  };
  stepNotes: Record<string, LText>;
}

export interface GlossaryTerm {
  id: string;
  term: LText;
  definition: LText;
}

export const procedures = proceduresData.procedures as Procedure[];
export const courts = courtsData.courts as Court[];
export const glossary = glossaryData.terms as GlossaryTerm[];

export function getProcedure(id: string): Procedure | undefined {
  return procedures.find((p) => p.id === id);
}

export function getCourt(id: string): Court | undefined {
  return courts.find((c) => c.id === id);
}

/** Picks the text in `lang`; falls back to Spanish and reports it (TRD §2d). */
export function tr<T>(value: ({ es: T } & Partial<Record<Lang, T>>) | undefined, lang: Lang): { text: T | undefined; fallback: boolean } {
  if (!value) return { text: undefined, fallback: false };
  const own = value[lang];
  if (own !== undefined) return { text: own, fallback: false };
  return { text: value.es, fallback: lang !== "es" };
}

/** Shorthand when the fallback flag is not needed. */
export function t1<T>(value: ({ es: T } & Partial<Record<Lang, T>>) | undefined, lang: Lang): T | undefined {
  return tr(value, lang).text;
}

export function phaseOf(kind: StepKind): Phase {
  switch (kind) {
    case "prepare":
    case "arrival":
    case "access":
      return "arrival";
    case "wait":
      return "wait";
    case "procedure":
      return "procedure";
    default:
      return "exit";
  }
}

export const PHASES: Phase[] = ["arrival", "wait", "procedure", "exit"];

/** Lowercase and strip accents so "Juício" matches "juicio". */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
