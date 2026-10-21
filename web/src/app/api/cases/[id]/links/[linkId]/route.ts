import type { NextRequest } from "next/server";
import { db } from "@/server/db";
import { authorizeOwner, json } from "@/server/security";

// Revokes a lawyer link at any time.
export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/cases/[id]/links/[linkId]">) {
  const { id, linkId } = await ctx.params;
  if (!authorizeOwner(req, id)) return json({ error: "not_found" }, 404);
  const result = db()
    .prepare("UPDATE lawyer_links SET revoked_at = ? WHERE id = ? AND user_case_id = ? AND revoked_at IS NULL")
    .run(new Date().toISOString(), linkId, id);
  if (result.changes === 0) return json({ error: "not_found" }, 404);
  return json({ ok: true });
}
