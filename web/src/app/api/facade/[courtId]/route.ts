import type { NextRequest } from "next/server";
import { getCourt } from "@/lib/catalog";
import { json } from "@/server/security";

// Facade image from the Street View Static API (TRD §3). The API key stays on the server:
// the browser only talks to this route. Images are not stored (Google terms).
// ?meta=1 returns availability and capture date from the free metadata endpoint.

const KEY = process.env.GOOGLE_MAPS_API_KEY;
const BASE = "https://maps.googleapis.com/maps/api/streetview";

export async function GET(req: NextRequest, ctx: RouteContext<"/api/facade/[courtId]">) {
  const { courtId } = await ctx.params;
  const court = getCourt(courtId);
  if (!court) return json({ error: "not_found" }, 404);
  if (!KEY) return json({ available: false, reason: "no_key" }, req.nextUrl.searchParams.has("meta") ? 200 : 404);

  const sv = court.entrance.streetView;
  const params = new URLSearchParams({ location: sv.location, key: KEY, source: "outdoor" });

  try {
    if (req.nextUrl.searchParams.has("meta")) {
      const res = await fetch(`${BASE}/metadata?${params}`, { signal: AbortSignal.timeout(5000) });
      const meta = (await res.json()) as { status?: string; date?: string };
      return json({ available: meta.status === "OK", date: meta.date ?? null });
    }

    params.set("size", "640x400");
    if (sv.heading !== undefined) params.set("heading", String(sv.heading));
    if (sv.pitch !== undefined) params.set("pitch", String(sv.pitch));
    if (sv.fov !== undefined) params.set("fov", String(sv.fov));
    params.set("return_error_code", "true");
    const res = await fetch(`${BASE}?${params}`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return json({ available: false }, 404);
    return new Response(res.body, {
      headers: { "Content-Type": res.headers.get("Content-Type") ?? "image/jpeg", "Cache-Control": "private, max-age=3600" },
    });
  } catch {
    // No internet at the demo venue: the client shows the text alternative.
    return json({ available: false, reason: "offline" }, req.nextUrl.searchParams.has("meta") ? 200 : 503);
  }
}
