"use client";

import { useCallback, useEffect, useState } from "react";
import { getCourt, getProcedure, type Court, type Procedure } from "@/lib/catalog";
import { api, type CaseData } from "@/lib/api";
import { getStoredCase, type StoredCase } from "@/lib/storage";

export interface CaseState {
  /** True until the server has answered (or failed). The steps can show before that. */
  loading: boolean;
  stored?: StoredCase;
  procedure?: Procedure;
  court?: Court;
  /** Server data (lawyer documents, links). Undefined if the server is unreachable. */
  data?: CaseData;
  reload: () => Promise<void>;
}

/**
 * Loads a case. Catalog content works offline; lawyer documents come from the server.
 * Must be used under <ClientOnly>: it reads the device storage on first render.
 */
export function useCase(id: string): CaseState {
  const [stored] = useState<StoredCase | undefined>(() => getStoredCase(id));
  const [data, setData] = useState<CaseData | undefined>();
  const [loading, setLoading] = useState(Boolean(stored));

  const fetchData = useCallback(
    () => (stored ? api<CaseData>(`/api/cases/${id}`, { secret: stored.secret }) : Promise.reject(new Error("no case"))),
    [id, stored],
  );

  useEffect(() => {
    if (!stored) return;
    let alive = true;
    fetchData()
      .then((d) => alive && setData(d))
      // Offline or unknown on the server: the steps still show.
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [fetchData, stored]);

  const reload = useCallback(async () => {
    try {
      setData(await fetchData());
    } catch {}
  }, [fetchData]);

  return {
    loading,
    stored,
    procedure: stored ? getProcedure(stored.procedureId) : undefined,
    court: stored ? getCourt(stored.courtId) : undefined,
    data,
    reload,
  };
}
