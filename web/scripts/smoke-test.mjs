// End-to-end smoke test of the API against a running server.
// Usage: npm run build && npm start   (in another terminal)  then  node scripts/smoke-test.mjs [baseUrl]
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3000";
let failures = 0;

function check(name, cond, extra = "") {
  console.log(`${cond ? "OK  " : "FAIL"} ${name}${extra ? ` — ${extra}` : ""}`);
  if (!cond) failures++;
}

async function call(p, { method, body, secret } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (secret) headers["x-case-secret"] = secret;
  const res = await fetch(BASE + p, { method: method ?? (body ? "POST" : "GET"), headers, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, data: await res.json().catch(() => null) };
}

// Pages
for (const p of ["/", "/cuestionario", "/ajustes", "/elegir", "/buscar", "/citacion", "/glosario"]) {
  const r = await fetch(BASE + p);
  check(`page ${p}`, r.status === 200, String(r.status));
}

// Case
const created = await call("/api/cases", { body: { procedureId: "juicio-verbal-vista", courtId: "madrid-primera-instancia", source: "search" } });
check("create case", created.status === 201);
const { id, secret } = created.data;
check("invalid case input rejected", (await call("/api/cases", { body: { procedureId: "x", courtId: "y" } })).status === 400);
check("case needs secret", (await call(`/api/cases/${id}`)).status === 404);
check("case wrong secret", (await call(`/api/cases/${id}`, { secret: "nope" })).status === 404);
check("case with secret", (await call(`/api/cases/${id}`, { secret })).status === 200);

// Lawyer link
const link = await call(`/api/cases/${id}/links`, { secret, body: { language: "ca" } });
check("create link", link.status === 201);
const hours = (Date.parse(link.data.expiresAt) - Date.now()) / 36e5;
check("link valid ~48h", hours > 47.9 && hours <= 48, hours.toFixed(2));
const tok = link.data.token;
const lv = await call(`/api/lawyer/${tok}`);
check("lawyer view", lv.status === 200 && lv.data.language === "ca" && !("secret" in lv.data));
check("lawyer view has no personal data", Object.keys(lv.data).sort().join() === "courtId,documents,expiresAt,language,lawyer,procedureId");
check("add before identify forbidden", (await call(`/api/lawyer/${tok}`, { body: { action: "add", name: "Contrato" } })).status === 403);
check("identify bad bar number", (await call(`/api/lawyer/${tok}`, { body: { action: "identify", name: "Ana Prueba", barNumber: "<script>" } })).status === 400);
check("identify", (await call(`/api/lawyer/${tok}`, { body: { action: "identify", name: "Ana Prueba Inventada", barNumber: "12345" } })).status === 200);
const added = await call(`/api/lawyer/${tok}`, { body: { action: "add", name: "Contrato de alquiler", notes: "Original y copia", kind: "bring" } });
check("lawyer adds document", added.status === 201);
const owner = await call(`/api/cases/${id}`, { secret });
const doc = owner.data.documents.find((d) => d.id === added.data.id);
check("owner sees lawyer document", doc?.addedBy === "lawyer" && doc?.lawyer?.barNumber === "12345");
check("owner accepts", (await call(`/api/cases/${id}/documents/${doc.id}`, { method: "PATCH", secret, body: { action: "accept" } })).status === 200);
check("other case cannot touch doc", (await call(`/api/cases/00000000-0000-0000-0000-000000000000/documents/${doc.id}`, { method: "PATCH", secret, body: { action: "reject" } })).status === 404);
check("bad token", (await call(`/api/lawyer/${"x".repeat(43)}`)).status === 404);
check("revoke", (await call(`/api/cases/${id}/links/${link.data.id}`, { method: "DELETE", secret })).status === 200);
check("revoked link unusable", (await call(`/api/lawyer/${tok}`)).status === 404);

// Citation extraction with synthetic citations
const expected = {
  "01-es-juicio-verbal-madrid.txt": ["juicio-verbal-vista", "madrid-primera-instancia", "2026-11-15", "10:30"],
  "02-ca-testimoni-barcelona.txt": ["testigo-juicio-civil", "bcn-ciutat-justicia", "2026-12-03", "09:45"],
  "03-gl-xuizo-verbal-madrid.txt": ["juicio-verbal-vista", "madrid-primera-instancia", "2026-11-20", "12:00"],
  "04-eu-lekukoa-barcelona.txt": ["testigo-juicio-civil", "bcn-ciutat-justicia", "2026-12-10", "11:15"],
  "05-es-fuera-de-catalogo.txt": [undefined, undefined, "2027-02-01", "09:00"],
  "06-es-demanda-division-cosa-comun.txt": ["division-cosa-comun-demandado", "madrid-primera-instancia", null, null],
};
const dir = path.join(import.meta.dirname, "..", "data", "citaciones-sinteticas");
for (const f of await readdir(dir)) {
  const form = new FormData();
  form.append("file", new Blob([await readFile(path.join(dir, f))], { type: "text/plain" }), f);
  const res = await fetch(BASE + "/api/citation", { method: "POST", body: form });
  const r = await res.json();
  const got = [r.procedures?.[0]?.id, r.courts?.[0]?.id, r.date, r.time];
  const exp = expected[f];
  check(`citation ${f}`, exp && got.every((v, i) => v === exp[i]), JSON.stringify(got));
}
// The citation route allows 6 requests per minute and there are now 6 sample citations: wait for the window to reset.
await new Promise((r) => setTimeout(r, 61_000));
const bad = new FormData();
bad.append("file", new Blob([new Uint8Array([1, 2, 3, 4])], { type: "application/octet-stream" }), "x.bin");
check("citation rejects unknown type", (await fetch(BASE + "/api/citation", { method: "POST", body: bad })).status === 415);

// Facade photos are static files
for (const f of ["madrid-primera-instancia", "bcn-ciutat-justicia"]) {
  const img = await fetch(BASE + `/images/facades/${f}.webp`);
  check(`facade photo ${f}`, img.status === 200 && img.headers.get("content-type") === "image/webp");
}

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
