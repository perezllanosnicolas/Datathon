// SQLite database for the mutable data only (docs/05-Backend-Schema.md):
// anonymous cases, lawyer links and case documents. The catalog is read from /data/catalog.
// No profile, needs or citation text is ever stored here.
import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), "data", "app.db");

const globalForDb = globalThis as unknown as { __bjDb?: DatabaseSync };

function open(): DatabaseSync {
  mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS user_cases (
      id TEXT PRIMARY KEY,
      owner_token_hash TEXT NOT NULL,
      procedure_id TEXT NOT NULL,
      court_id TEXT NOT NULL,
      source TEXT NOT NULL CHECK (source IN ('search', 'citation')),
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lawyer_links (
      id TEXT PRIMARY KEY,
      user_case_id TEXT NOT NULL REFERENCES user_cases(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      language TEXT NOT NULL DEFAULT 'es',
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      revoked_at TEXT,
      last_used_at TEXT,
      lawyer_name TEXT,
      lawyer_bar_number TEXT
    );

    CREATE TABLE IF NOT EXISTS case_documents (
      id TEXT PRIMARY KEY,
      user_case_id TEXT NOT NULL REFERENCES user_cases(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      kind TEXT NOT NULL CHECK (kind IN ('bring', 'receive')),
      notes TEXT,
      added_by TEXT NOT NULL CHECK (added_by IN ('catalog', 'lawyer', 'user')),
      lawyer_link_id TEXT REFERENCES lawyer_links(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'edited', 'rejected')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_docs_case ON case_documents(user_case_id);
    CREATE INDEX IF NOT EXISTS idx_links_case ON lawyer_links(user_case_id);
  `);
  return db;
}

export function db(): DatabaseSync {
  globalForDb.__bjDb ??= open();
  return globalForDb.__bjDb;
}

export interface CaseRow {
  id: string;
  owner_token_hash: string;
  procedure_id: string;
  court_id: string;
  source: string;
  created_at: string;
}

export interface LinkRow {
  id: string;
  user_case_id: string;
  token_hash: string;
  language: string;
  created_at: string;
  expires_at: string;
  revoked_at: string | null;
  last_used_at: string | null;
  lawyer_name: string | null;
  lawyer_bar_number: string | null;
}

export interface DocRow {
  id: string;
  user_case_id: string;
  name: string;
  kind: "bring" | "receive";
  notes: string | null;
  added_by: "catalog" | "lawyer" | "user";
  lawyer_link_id: string | null;
  status: "pending" | "accepted" | "edited" | "rejected";
  created_at: string;
  updated_at: string;
}
