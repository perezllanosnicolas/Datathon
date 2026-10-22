// Downloads the ARASAAC pictograms listed in data/catalog/pictograms.json into
// public/pictos/arasaac/, so the app works offline. Usage: npm run pictos
// Licence: CC BY-NC-SA (Sergio Palao, ARASAAC, Gobierno de Aragón). Keep the attribution visible.
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const data = JSON.parse(await readFile(path.join(root, "data", "catalog", "pictograms.json"), "utf8"));
const outDir = path.join(root, "public", "pictos", "arasaac");
await mkdir(outDir, { recursive: true });

const ids = [...new Set([...Object.values(data.steps), ...Object.values(data.documents), ...Object.values(data.extras)])];
let fetched = 0;
for (const id of ids) {
  const file = path.join(outDir, `${id}.png`);
  try {
    await access(file);
    continue;
  } catch {}
  const res = await fetch(`https://static.arasaac.org/pictograms/${id}/${id}_500.png`);
  if (!res.ok) throw new Error(`Pictogram ${id}: HTTP ${res.status}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  fetched++;
}
console.log(`${ids.length} pictograms ready (${fetched} downloaded) in public/pictos/arasaac/`);
