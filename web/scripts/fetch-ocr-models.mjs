// Downloads the OCR models (spa, cat, glg, eus) into data/tessdata so the citation upload
// works offline from the first request. Used by the Docker image and before a demo without internet.
// Same languages and folder as src/server/ocr.ts.
import { mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { createWorker } from "tesseract.js";

const cache = path.join(import.meta.dirname, "..", "data", "tessdata");
mkdirSync(cache, { recursive: true });

const worker = await createWorker("spa+cat+glg+eus", 1, { cachePath: cache });
await worker.terminate();

for (const f of readdirSync(cache)) console.log(`${f}  ${(statSync(path.join(cache, f)).size / 1e6).toFixed(1)} MB`);
