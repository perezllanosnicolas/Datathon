// Writes data/realistic/available.json with the file names of the realistic images (one per step slot)
// in public/images/realistic/, so the app never requests a file that does not exist.
// Runs before every build and after `npm run images:real`.
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const dir = path.join(root, "public", "images", "realistic");
const files = await readdir(dir).catch(() => []);
const list = files.filter((f) => /\.(png|webp|jpe?g)$/.test(f)).sort();
await writeFile(path.join(root, "data", "realistic", "available.json"), JSON.stringify(list, null, 2) + "\n");
console.log(`${list.length} realistic image(s) available`);
