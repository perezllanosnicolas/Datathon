import { extract } from "@/lib/extract";
import { sniff, toText } from "@/server/ocr";
import { clientKey, json, rateLimited } from "@/server/security";

export const maxDuration = 120;

const MAX_BYTES = 8 * 1024 * 1024;

// Upload → text → procedure/court candidates. The file and the text are discarded
// when the request ends; only the catalog ids go back to the browser.
export async function POST(req: Request) {
  if (rateLimited(clientKey(req, "citation"), 6)) return json({ error: "rate_limited" }, 429);

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return json({ error: "no_file" }, 400);
  if (file.size > MAX_BYTES) return json({ error: "too_big" }, 413);

  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buf, file.type);
  if (!kind) return json({ error: "bad_type" }, 415);

  let text: string;
  try {
    text = await toText(buf, kind);
  } catch {
    return json({ error: "read_failed" }, 422);
  } finally {
    buf.fill(0);
  }

  if (text.replace(/\s/g, "").length < 20) return json({ error: "read_failed" }, 422);
  const result = extract(text);
  return json(result);
}
