import type { NextRequest } from "next/server";
import { db, type DocRow, type LinkRow } from "@/server/db";
import { authorizeOwner, json } from "@/server/security";

// Owner view of a case: its documents (lawyer/user) and the state of its lawyer links.
export async function GET(req: NextRequest, ctx: RouteContext<"/api/cases/[id]">) {
  const { id } = await ctx.params;
  const row = authorizeOwner(req, id);
  if (!row) return json({ error: "not_found" }, 404);

  const docs = db().prepare("SELECT * FROM case_documents WHERE user_case_id = ? ORDER BY created_at").all(id) as unknown as DocRow[];
  const links = db().prepare("SELECT * FROM lawyer_links WHERE user_case_id = ? ORDER BY created_at DESC").all(id) as unknown as LinkRow[];
  const linkById = new Map(links.map((l) => [l.id, l]));

  return json({
    case: { id: row.id, procedureId: row.procedure_id, courtId: row.court_id, source: row.source, createdAt: row.created_at },
    documents: docs.map((d) => {
      const link = d.lawyer_link_id ? linkById.get(d.lawyer_link_id) : undefined;
      return {
        id: d.id,
        name: d.name,
        kind: d.kind,
        notes: d.notes,
        addedBy: d.added_by,
        status: d.status,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
        lawyer: link ? { name: link.lawyer_name, barNumber: link.lawyer_bar_number } : null,
      };
    }),
    links: links.map((l) => ({
      id: l.id,
      createdAt: l.created_at,
      expiresAt: l.expires_at,
      revokedAt: l.revoked_at,
      lawyerName: l.lawyer_name,
      lawyerBarNumber: l.lawyer_bar_number,
    })),
  });
}
