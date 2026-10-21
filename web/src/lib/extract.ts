// Citation text → procedure and court, matched ONLY against the reviewed catalog
// (TRD §2b, step 2–3). Rules and keywords, no generative model. Pure function: testable.
import { courts, LANGUAGES, normalize, procedures } from "./catalog";

export interface Candidate {
  id: string;
  score: number;
}

export interface Extraction {
  procedures: Candidate[];
  courts: Candidate[];
  date: string | null; // ISO yyyy-mm-dd
  time: string | null; // HH:MM
}

// Role words decide the procedure even if the citation also names the main trial
// (a witness summons usually says "juicio verbal" too). Weights are tunable.
const ROLE_BOOST: Record<string, string[]> = {
  "testigo-juicio-civil": ["testigo", "testimoni", "testemuna", "lekuko", "lekukoa", "en calidad de testigo", "en qualitat de testimoni"],
};

function countMatches(haystack: string, needle: string): number {
  if (!needle) return 0;
  const re = new RegExp(`(^|\\s)${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=\\s|$)`, "g");
  return haystack.match(re)?.length ?? 0;
}

function termWeight(term: string): number {
  const words = term.split(" ").length;
  return words > 1 ? words * 3 : 1;
}

const MONTHS: Record<string, number> = {
  // es
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6, julio: 7, agosto: 8, septiembre: 9, setiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
  // ca
  gener: 1, febrer: 2, marc: 3, maig: 5, juny: 6, juliol: 7, setembre: 9, novembre: 11, desembre: 12,
  // gl
  xaneiro: 1, febreiro: 2, maio: 5, xuno: 6, xullo: 7, setembro: 9, outubro: 10, novembro: 11, decembro: 12,
  // eu
  urtarrila: 1, otsaila: 2, martxoa: 3, apirila: 4, maiatza: 5, ekaina: 6, uztaila: 7, abuztua: 8, iraila: 9, urria: 10, azaroa: 11, abendua: 12,
};

function iso(y: number, m: number, d: number): string | null {
  if (y < 100) y += 2000;
  if (m < 1 || m > 12 || d < 1 || d > 31 || y < 2000 || y > 2100) return null;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function findDate(text: string): string | null {
  const n = normalize(text.replace(/[/.-]/g, " / "));
  const numeric = text.match(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})\b/);
  if (numeric) {
    const r = iso(+numeric[3], +numeric[2], +numeric[1]);
    if (r) return r;
  }
  // "15 de noviembre de 2026" / "15 de novembre de 2026" / "15 de novembro de 2026"
  const words = n.match(/\b(\d{1,2}) d(?:e|')? ?([a-z]+) (?:de |del )?(\d{4})\b/);
  if (words) {
    const m = MONTHS[words[2]];
    if (m) return iso(+words[3], m, +words[1]);
  }
  // Basque: "2026ko azaroaren 15ean"
  const eu = n.match(/\b(\d{4})ko ([a-z]+?)(?:ren|aren)? (\d{1,2})/);
  if (eu) {
    const key = Object.keys(MONTHS).find((k) => eu[2].startsWith(k.slice(0, -1)));
    if (key) return iso(+eu[1], MONTHS[key], +eu[3]);
  }
  return null;
}

export function findTime(text: string): string | null {
  // Only ":" or "h" as separator, so a date like 15.11.2026 is never read as a time.
  // (?!\d) instead of \b so Basque suffixes work: "11:15ean".
  const m = text.match(/\b([01]?\d|2[0-3])(?::|h)([0-5]\d)(?!\d)/i);
  return m ? `${m[1].padStart(2, "0")}:${m[2]}` : null;
}

export function extract(text: string): Extraction {
  const n = normalize(text);

  const procScores: Candidate[] = procedures.map((p) => {
    let score = 0;
    for (const lang of LANGUAGES) {
      for (const term of p.searchTerms[lang] ?? []) {
        score += countMatches(n, normalize(term)) * termWeight(normalize(term));
      }
    }
    for (const term of ROLE_BOOST[p.id] ?? []) score += countMatches(n, normalize(term)) * 10;
    return { id: p.id, score };
  });

  const courtScores: Candidate[] = courts.map((c) => {
    let score = 0;
    const terms = [...c.searchTerms, ...LANGUAGES.map((l) => c.name[l]).filter(Boolean)] as string[];
    for (const term of terms) score += countMatches(n, normalize(term)) * termWeight(normalize(term));
    return { id: c.id, score };
  });

  const rank = (xs: Candidate[]) => xs.filter((x) => x.score > 0).sort((a, b) => b.score - a.score);

  return { procedures: rank(procScores), courts: rank(courtScores), date: findDate(text), time: findTime(text) };
}
