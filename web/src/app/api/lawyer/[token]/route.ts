import type { NextRequest } from "next/server";
import { db, type DocRow } from "@/server/db";
import { checkLawyerToken, cleanText, clientKey, json, newId, rateLimited } from "@/server/security";

// Lawyer endpoints (TRD §2c): scoped to one case by the token. They only expose the
// procedure and court ids, and the documents this link added. Never the person's data.

const NAME_RE = /^[\p{L}][\p{L}\s.'-]{1,119}$/u;
const BAR_RE = /^[A-Za-z0-9][A-Za-z0-9 ./-]{0,19}$/;
const MAX_DOCS_PER_LINK = 30;

function linkView(token: string) {
  const check = checkLawyerToken(token);
  if (!check.ok) return null;
  const { link } = check;
  const kase = db().prepare("SELECT procedure_id, court_id FROM user_cases WHERE id = ?").get(link.user_case_id) as
    | { procedure_id: string; court_id: string }
    | undefined;
  if (!kase) return null;
  const docs = db()
    .prepare("SELECT id, name, kind, notes, status, created_at FROM case_documents WHERE lawyer_link_id = ? ORDER BY created_at")
    .all(link.id) as unknown as Pick<DocRow, "id" | "name" | "kind" | "notes" | "status" | "created_at">[];
  return { link, kase, docs };
}

export async function GET(req: NextRequest, ctx: RouteContext<"/api/lawyer/[token]">) {
  if (rateLimited(clientKey(req, "lawyer"), 60)) return json({ error: "rate_limited" }, 429);
  const { token } = await ctx.params;
  const view = linkView(token);
  if (!view) return json({ error: "invalid_link" }, 404);
  const { link, kase, docs } = view;
  db().prepare("UPDATE lawyer_links SET last_used_at = ? WHERE id = ?").run(new Date().toISOString(), link.id);
  return json({
    procedureId: kase.procedure_id,
    courtId: kase.court_id,
    language: link.language,
    expiresAt: link.expires_at,
    lawyer: link.lawyer_name ? { name: link.lawyer_name, barNumber: link.lawyer_bar_number } : null,
    documents: docs.filter((d) => d.status !== "rejected").map((d) => ({ id: d.id, name: d.name, kind: d.kind, notes: d.notes })),
  });
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/lawyer/[token]">) {
  if (rateLimited(clientKey(req, "lawyer-write"), 20)) return json({ error: "rate_limited" }, 429);
  const { token } = await ctx.params;
  const view = linkView(token);
  if (!view) return json({ error: "invalid_link" }, 404);
  const { link } = view;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const now = new Date().toISOString();

  if (body?.action === "identify") {
    const name = cleanText(body.name, 120);
    const bar = cleanText(body.barNumber, 20);
    if (!NAME_RE.test(name) || !BAR_RE.test(bar)) return json({ error: "invalid_input" }, 400);
    db().prepare("UPDATE lawyer_links SET lawyer_name = ?, lawyer_bar_number = ?, last_used_at = ? WHERE id = ?").run(name, bar, now, link.id);
    return json({ ok: true });
  }

  if (body?.action === "add") {
    // Name and bar number are mandatory before adding documents (decision 2026-10-21).
    if (!link.lawyer_name || !link.lawyer_bar_number) return json({ error: "identify_first" }, 403);
    const name = cleanText(body.name, 120);
    const notes = cleanText(body.notes, 500);
    const kind = body.kind === "receive" ? "receive" : "bring";
    if (!name) return json({ error: "invalid_input" }, 400);
    if (view.docs.length >= MAX_DOCS_PER_LINK) return json({ error: "too_many_documents" }, 400);
    const id = newId();
    db()
      .prepare(
        "INSERT INTO case_documents (id, user_case_id, name, kind, notes, added_by, lawyer_link_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'lawyer', ?, 'pending', ?, ?)",
      )
      .run(id, link.user_case_id, name, kind, notes || null, link.id, now, now);
    return json({ id }, 201);
  }

  return json({ error: "invalid_input" }, 400);
}
