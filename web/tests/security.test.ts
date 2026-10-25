// Secrets, lawyer tokens, rate limit and input cleaning (src/server/security.ts, TRD §2c).
import { rmSync } from "node:fs";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";

// Start from an empty database even if a previous run was interrupted.
rmSync(path.dirname(process.env.DB_PATH!), { recursive: true, force: true });

const { db } = await import("@/server/db");
const { checkLawyerToken, cleanText, clientKey, hash, LINK_TTL_MS, newId, newSecret, rateLimited } = await import("@/server/security");

afterAll(() => {
  db().close(); // Windows cannot delete an open SQLite file
  rmSync(path.dirname(process.env.DB_PATH!), { recursive: true, force: true });
});

describe("secrets", () => {
  it("are long, URL-safe and different each time", () => {
    const a = newSecret();
    expect(a).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(newSecret()).not.toBe(a);
  });

  it("are stored as SHA-256 hex", () => {
    expect(hash("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
});

describe("checkLawyerToken()", () => {
  const caseId = newId();
  const now = Date.now();
  const insertLink = (token: string, expires: number, revoked: string | null = null) =>
    db()
      .prepare("INSERT INTO lawyer_links (id, user_case_id, token_hash, created_at, expires_at, revoked_at) VALUES (?, ?, ?, ?, ?, ?)")
      .run(newId(), caseId, hash(token), new Date(now).toISOString(), new Date(expires).toISOString(), revoked);

  db()
    .prepare("INSERT INTO user_cases (id, owner_token_hash, procedure_id, court_id, source, created_at) VALUES (?, ?, ?, ?, 'search', ?)")
    .run(caseId, hash("owner"), "juicio-verbal-vista", "madrid-primera-instancia", new Date(now).toISOString());

  const valid = newSecret();
  const expired = newSecret();
  const revoked = newSecret();
  insertLink(valid, now + LINK_TTL_MS);
  insertLink(expired, now - 1000);
  insertLink(revoked, now + LINK_TTL_MS, new Date(now).toISOString());

  it("accepts a valid token", () => expect(checkLawyerToken(valid).ok).toBe(true));
  it("rejects an expired token", () => expect(checkLawyerToken(expired).ok).toBe(false));
  it("rejects a revoked token", () => expect(checkLawyerToken(revoked).ok).toBe(false));
  it("rejects an unknown token", () => expect(checkLawyerToken(newSecret()).ok).toBe(false));
  it("rejects malformed tokens before touching the database", () => {
    expect(checkLawyerToken("short").ok).toBe(false);
    expect(checkLawyerToken("x".repeat(40) + "'; DROP TABLE x;--").ok).toBe(false);
  });
  it("lasts 48 hours", () => expect(LINK_TTL_MS).toBe(48 * 3600 * 1000));
});

describe("rateLimited()", () => {
  it("allows up to max requests per window, then blocks", () => {
    const key = `test:${Math.random()}`;
    const results = Array.from({ length: 4 }, () => rateLimited(key, 3, 60_000));
    expect(results).toEqual([false, false, false, true]);
  });

  it("keys by the first forwarded IP and scope", () => {
    const req = new Request("http://x", { headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" } });
    expect(clientKey(req, "citation")).toBe("citation:1.2.3.4");
    expect(clientKey(new Request("http://x"), "cases")).toBe("cases:local");
  });
});

describe("cleanText()", () => {
  it("trims, removes control characters and limits length", () => {
    expect(cleanText("  hola\u0000mundo\n ", 100)).toBe("hola mundo");
    expect(cleanText("abcdef", 3)).toBe("abc");
    expect(cleanText(42, 10)).toBe("");
  });
});
