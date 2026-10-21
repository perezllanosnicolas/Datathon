import type { NextRequest } from "next/server";
import { LANGUAGES, type Lang } from "@/lib/catalog";
import { db } from "@/server/db";
import { authorizeOwner, clientKey, hash, json, LINK_TTL_MS, newId, newSecret, rateLimited } from "@/server/security";

// Creates a lawyer link valid for 48 hours. The token is only returned here, once.
export async function POST(req: NextRequest, ctx: RouteContext<"/api/cases/[id]/links">) {
  const { id } = await ctx.params;
  if (rateLimited(clientKey(req, "links"), 10)) return json({ error: "rate_limited" }, 429);
  if (!authorizeOwner(req, id)) return json({ error: "not_found" }, 404);

  const body = (await req.json().catch(() => null)) as { language?: string } | null;
  const language: Lang = LANGUAGES.includes(body?.language as Lang) ? (body!.language as Lang) : "es";

  const linkId = newId();
  const token = newSecret();
  const created = new Date();
  const expires = new Date(created.getTime() + LINK_TTL_MS);
  db()
    .prepare("INSERT INTO lawyer_links (id, user_case_id, token_hash, language, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)")
    .run(linkId, id, hash(token), language, created.toISOString(), expires.toISOString());

  return json({ id: linkId, token, expiresAt: expires.toISOString() }, 201);
}
