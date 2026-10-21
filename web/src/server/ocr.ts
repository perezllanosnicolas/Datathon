// Document → text, on our own server (decision 2026-10-21: no third parties).
// Everything happens in memory: the file is never written to disk and the text is not logged.
import "server-only";
import path from "node:path";
import { createWorker, type Worker } from "tesseract.js";

// Spanish, Catalan, Galician and Basque models (TRD §2d).
const OCR_LANGS = "spa+cat+glg+eus";
// Models are downloaded once into data/tessdata and reused offline afterwards.
const CACHE = path.join(process.cwd(), "data", "tessdata");

const g = globalThis as unknown as { __bjOcr?: Promise<Worker> };

function worker(): Promise<Worker> {
  g.__bjOcr ??= createWorker(OCR_LANGS, 1, { cachePath: CACHE }).catch((e) => {
    g.__bjOcr = undefined;
    throw e;
  });
  return g.__bjOcr;
}

export type FileKind = "pdf" | "png" | "jpeg" | "text";

/** Detects the type from the first bytes, not from the name the browser sent. */
export function sniff(buf: Buffer, declaredType: string): FileKind | null {
  if (buf.subarray(0, 4).toString("latin1") === "%PDF") return "pdf";
  if (buf[0] === 0x89 && buf.subarray(1, 4).toString("latin1") === "PNG") return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  // Plain text is accepted to test the extraction with synthetic citations.
  if (declaredType === "text/plain") return "text";
  return null;
}

export async function toText(buf: Buffer, kind: FileKind): Promise<string> {
  if (kind === "text") return buf.toString("utf8");
  if (kind === "pdf") {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buf));
    const { text } = await extractText(pdf, { mergePages: true });
    return text;
  }
  const w = await worker();
  const { data } = await w.recognize(buf);
  return data.text;
}
