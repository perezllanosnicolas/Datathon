import "server-only";
import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { db, type CaseRow, type LinkRow } from "./db";

export const LINK_TTL_MS = 48 * 60 * 60 * 1000; // 48 hours (decision 2026-10-21)

export function newSecret(): string {
  return randomBytes(32).toString("base64url");
}

export function newId(): string {
  return randomUUID();
}

export function hash(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

function sameHash(a: string, b: string): boolean {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/** Returns the case only if the request carries its owner secret. */
export function authorizeOwner(req: Request, caseId: string): CaseRow | null {
  const secret = req.headers.get("x-case-secret");
  if (!secret) return null;
  const row = db().prepare("SELECT * FROM user_cases WHERE id = ?").get(caseId) as CaseRow | undefined;
  if (!row || !sameHash(row.owner_token_hash, hash(secret))) return null;
  return row;
}

export type LinkCheck = { ok: true; link: LinkRow } | { ok: false };

/** Validates a lawyer token on every call: exists, not revoked, not expired. */
export function checkLawyerToken(token: string): LinkCheck {
  if (!/^[A-Za-z0-9_-]{30,64}$/.test(token)) return { ok: false };
  const link = db().prepare("SELECT * FROM lawyer_links WHERE token_hash = ?").get(hash(token)) as LinkRow | undefined;
  if (!link || link.revoked_at || Date.parse(link.expires_at) <= Date.now()) return { ok: false };
  return { ok: true, link };
}

// Simple in-memory rate limit: enough for a single-machine demo.
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimited(key: string, max = 30, windowMs = 60_000): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  b.count++;
  return b.count > max;
}

export function clientKey(req: Request, scope: string): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "local";
  return `${scope}:${ip}`;
}

/** Trims and limits free text coming from forms. */
export function cleanText(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "";
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}
