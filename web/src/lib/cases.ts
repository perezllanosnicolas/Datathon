import { api } from "./api";
import { saveCase } from "./storage";

/** Creates the anonymous case and keeps its secret on this device only. */
export async function createCase(procedureId: string, courtId: string, source: "search" | "citation"): Promise<string> {
  const { id, secret } = await api<{ id: string; secret: string }>("/api/cases", { body: { procedureId, courtId, source } });
  saveCase({ id, secret, procedureId, courtId, source, createdAt: new Date().toISOString() });
  return id;
}
