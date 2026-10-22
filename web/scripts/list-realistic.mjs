// Writes data/realistic/available.json with the steps that have a generated realistic image
// in public/images/realistic/, so the app never requests a file that does not exist.
// Runs before every build and after `npm run images:real`.
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const dir = path.join(root, "public", "images", "realistic");
const files = await readdir(dir).catch(() => []);
const slots = files.filter((f) => f.endsWith(".png")).map((f) => f.slice(0, -4)).sort();
await writeFile(path.join(root, "data", "realistic", "available.json"), JSON.stringify(slots, null, 2) + "\n");
console.log(`${slots.length} realistic image(s) available`);
