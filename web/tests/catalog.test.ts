// Integrity of the JSON catalog edited by the Law team (docs/05-Backend-Schema.md §5).
// A broken catalog fails here instead of in front of a user.
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { courts, getCourt, getProcedure, glossary, normalize, phaseOf, procedures, tr, type LText } from "@/lib/catalog";

const publicDir = path.join(import.meta.dirname, "..", "public");
const STEP_KINDS = ["prepare", "arrival", "access", "wait", "procedure", "exit"];

const hasSpanish = (t: LText | undefined) => typeof t?.es === "string" && t.es.trim().length > 0;
const unique = (xs: string[]) => new Set(xs).size === xs.length;

describe("procedures.json", () => {
  it("has unique procedure ids", () => expect(unique(procedures.map((p) => p.id))).toBe(true));

  it.each(procedures.map((p) => [p.id, p] as const))("%s is well formed", (_, p) => {
    expect(hasSpanish(p.name)).toBe(true);
    expect(hasSpanish(p.summary)).toBe(true);
    expect(p.searchTerms.es?.length).toBeGreaterThan(0);
    expect(p.steps.length).toBeGreaterThan(0);
    expect(unique(p.steps.map((s) => s.id))).toBe(true);

    for (const s of p.steps) {
      expect(STEP_KINDS).toContain(s.kind);
      expect(hasSpanish(s.title)).toBe(true);
      expect(hasSpanish(s.expected)).toBe(true);
      expect(s.instructions.es.length).toBeGreaterThan(0);
      const [min, max] = s.durationMin;
      expect(min).toBeGreaterThanOrEqual(0);
      expect(max).toBeGreaterThanOrEqual(min);
      for (const d of s.documents) {
        expect(["bring", "receive"]).toContain(d.kind);
        expect(hasSpanish(d.name)).toBe(true);
      }
    }
  });
});

describe("courts.json", () => {
  it("has unique court ids", () => expect(unique(courts.map((c) => c.id))).toBe(true));

  it.each(courts.map((c) => [c.id, c] as const))("%s has a facade photo with credit and a text alternative", (_, c) => {
    expect(hasSpanish(c.name)).toBe(true);
    expect(c.entrance.photo.credit).not.toBe("");
    expect(existsSync(path.join(publicDir, c.entrance.photo.src))).toBe(true);
    // Screen reader users need the same information as the photo (TRD §3).
    expect(hasSpanish(c.entrance.textDescription)).toBe(true);
  });

  it("every procedure type offered has at least one court", () => {
    for (const p of procedures) expect(courts.some((c) => c.processTypes.includes(p.processType))).toBe(true);
  });
});

describe("glossary.json", () => {
  it("has unique ids and a Spanish definition for each term", () => {
    expect(unique(glossary.map((g) => g.id))).toBe(true);
    for (const g of glossary) {
      expect(hasSpanish(g.term)).toBe(true);
      expect(hasSpanish(g.definition)).toBe(true);
    }
  });
});

describe("catalog helpers", () => {
  it("looks up by id", () => {
    expect(getProcedure(procedures[0].id)).toBe(procedures[0]);
    expect(getCourt("does-not-exist")).toBeUndefined();
  });

  it("falls back to Spanish and flags it", () => {
    expect(tr({ es: "hola", ca: "hola!" }, "ca")).toEqual({ text: "hola!", fallback: false });
    expect(tr({ es: "hola" }, "eu")).toEqual({ text: "hola", fallback: true });
    expect(tr({ es: "hola" }, "es")).toEqual({ text: "hola", fallback: false });
  });

  it("normalizes accents, case and punctuation", () => {
    expect(normalize("  Juício   VERBAL, ¿sí? ")).toBe("juicio verbal si");
  });

  it("groups step kinds into the four progress phases", () => {
    expect(["prepare", "arrival", "access"].map((k) => phaseOf(k as never))).toEqual(["arrival", "arrival", "arrival"]);
    expect(phaseOf("wait")).toBe("wait");
    expect(phaseOf("procedure")).toBe("procedure");
    expect(phaseOf("exit")).toBe("exit");
  });
});
