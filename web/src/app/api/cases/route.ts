import { getCourt, getProcedure } from "@/lib/catalog";
import { db } from "@/server/db";
import { clientKey, hash, json, newId, newSecret, rateLimited } from "@/server/security";

// Creates an anonymous case. The owner secret is returned once and kept on the device.
export async function POST(req: Request) {
  if (rateLimited(clientKey(req, "cases"), 20)) return json({ error: "rate_limited" }, 429);
  const body = (await req.json().catch(() => null)) as { procedureId?: string; courtId?: string; source?: string } | null;
  const procedure = body?.procedureId ? getProcedure(body.procedureId) : undefined;
  const court = body?.courtId ? getCourt(body.courtId) : undefined;
  if (!procedure || !court) return json({ error: "invalid_input" }, 400);
  const source = body?.source === "citation" ? "citation" : "search";

  const id = newId();
  const secret = newSecret();
  db()
    .prepare("INSERT INTO user_cases (id, owner_token_hash, procedure_id, court_id, source, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .run(id, hash(secret), procedure.id, court.id, source, new Date().toISOString());

  return json({ id, secret }, 201);
}
