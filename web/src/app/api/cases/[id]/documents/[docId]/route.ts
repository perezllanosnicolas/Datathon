import type { NextRequest } from "next/server";
import { db } from "@/server/db";
import { authorizeOwner, cleanText, json } from "@/server/security";

// The person accepts, edits or removes a document added by their lawyer.
export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/cases/[id]/documents/[docId]">) {
  const { id, docId } = await ctx.params;
  if (!authorizeOwner(req, id)) return json({ error: "not_found" }, 404);

  const body = (await req.json().catch(() => null)) as { action?: string; name?: string; notes?: string } | null;
  const now = new Date().toISOString();
  const stmt = (sql: string, ...args: (string | null)[]) => db().prepare(sql).run(...args, docId, id);

  let result;
  switch (body?.action) {
    case "accept":
      result = stmt("UPDATE case_documents SET status = 'accepted', updated_at = ? WHERE id = ? AND user_case_id = ?", now);
      break;
    case "reject":
      result = stmt("UPDATE case_documents SET status = 'rejected', updated_at = ? WHERE id = ? AND user_case_id = ?", now);
      break;
    case "edit": {
      const name = cleanText(body.name, 120);
      if (!name) return json({ error: "invalid_input" }, 400);
      result = stmt(
        "UPDATE case_documents SET name = ?, notes = ?, status = 'edited', updated_at = ? WHERE id = ? AND user_case_id = ?",
        name,
        cleanText(body.notes, 500) || null,
        now,
      );
      break;
    }
    default:
      return json({ error: "invalid_input" }, 400);
  }
  if (result.changes === 0) return json({ error: "not_found" }, 404);
  return json({ ok: true });
}
