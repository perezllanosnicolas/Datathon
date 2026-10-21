// Small fetch helpers for the browser.

export interface CaseDocument {
  id: string;
  name: string;
  kind: "bring" | "receive";
  notes: string | null;
  addedBy: "catalog" | "lawyer" | "user";
  status: "pending" | "accepted" | "edited" | "rejected";
  createdAt: string;
  updatedAt: string;
  lawyer: { name: string | null; barNumber: string | null } | null;
}

export interface CaseLink {
  id: string;
  createdAt: string;
  expiresAt: string;
  revokedAt: string | null;
  lawyerName: string | null;
  lawyerBarNumber: string | null;
}

export interface CaseData {
  case: { id: string; procedureId: string; courtId: string; source: string; createdAt: string };
  documents: CaseDocument[];
  links: CaseLink[];
}

export class ApiError extends Error {
  constructor(public status: number, public code: string) {
    super(code);
  }
}

export async function api<T>(path: string, opts: { method?: string; body?: unknown; secret?: string } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.secret) headers["x-case-secret"] = opts.secret;
  const res = await fetch(path, {
    method: opts.method ?? (opts.body !== undefined ? "POST" : "GET"),
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error ?? "error");
  return data as T;
}
