// Citation text → procedure, court, date and time (src/lib/extract.ts, TRD §2b).
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { extract, findDate, findTime } from "@/lib/extract";

const dir = path.join(import.meta.dirname, "..", "data", "citaciones-sinteticas");
const read = (f: string) => readFileSync(path.join(dir, f), "utf8");

// Same expectations as scripts/smoke-test.mjs, but without a running server.
const cases: [string, string | undefined, string | undefined, string | null, string | null][] = [
  ["01-es-juicio-verbal-madrid.txt", "juicio-verbal-vista", "madrid-primera-instancia", "2026-11-15", "10:30"],
  ["02-ca-testimoni-barcelona.txt", "testigo-juicio-civil", "bcn-ciutat-justicia", "2026-12-03", "09:45"],
  ["03-gl-xuizo-verbal-madrid.txt", "juicio-verbal-vista", "madrid-primera-instancia", "2026-11-20", "12:00"],
  ["04-eu-lekukoa-barcelona.txt", "testigo-juicio-civil", "bcn-ciutat-justicia", "2026-12-10", "11:15"],
  ["05-es-fuera-de-catalogo.txt", undefined, undefined, "2027-02-01", "09:00"],
  ["06-es-demanda-division-cosa-comun.txt", "division-cosa-comun-demandado", "madrid-primera-instancia", null, null],
];

describe("extract() with the synthetic citations", () => {
  it.each(cases)("%s", (file, procedure, court, date, time) => {
    const r = extract(read(file));
    expect(r.procedures[0]?.id).toBe(procedure);
    expect(r.courts[0]?.id).toBe(court);
    expect(r.date).toBe(date);
    expect(r.time).toBe(time);
  });

  it("returns only catalog ids, ranked by score", () => {
    const r = extract(read("01-es-juicio-verbal-madrid.txt"));
    const scores = r.procedures.map((p) => p.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
    expect(scores.every((s) => s > 0)).toBe(true);
  });

  it("finds nothing in unrelated text", () => {
    const r = extract("Lista de la compra: pan, leche y huevos.");
    expect(r.procedures).toEqual([]);
    expect(r.courts).toEqual([]);
  });
});

describe("findDate()", () => {
  it.each([
    ["El día 15/11/2026 a las 10:30", "2026-11-15"],
    ["fecha 3-12-26", "2026-12-03"],
    ["15 de noviembre de 2026", "2026-11-15"],
    ["3 de desembre de 2026", "2026-12-03"],
    ["20 de novembro de 2026", "2026-11-20"],
    ["2026ko abenduaren 10ean", "2026-12-10"],
  ])("%s → %s", (text, iso) => expect(findDate(text)).toBe(iso));

  it("rejects impossible dates", () => {
    expect(findDate("31/13/2026")).toBeNull();
    expect(findDate("sin fecha")).toBeNull();
  });
});

describe("findTime()", () => {
  it.each([
    ["a las 10:30 horas", "10:30"],
    ["9h45", "09:45"],
    ["11:15ean", "11:15"],
  ])("%s → %s", (text, hhmm) => expect(findTime(text)).toBe(hhmm));

  it("does not read a dotted date as a time", () => {
    expect(findTime("15.11.2026")).toBeNull();
  });
});
