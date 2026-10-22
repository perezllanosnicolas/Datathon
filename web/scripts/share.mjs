// Starts the prototype for a phone: prints the URL and a QR code to open it.
// Usage: npm run share            (build + production server, recommended for the demo)
//        npm run share -- --dev   (dev server)
// PUBLIC_URL=https://xxxx.trycloudflare.com npm run share   (QR for a tunnel URL, to use outside the Wi-Fi)
import { spawn, spawnSync } from "node:child_process";
import { networkInterfaces } from "node:os";
import path from "node:path";
import qrcode from "qrcode-terminal";

const root = path.join(import.meta.dirname, "..");
const next = path.join(root, "node_modules", "next", "dist", "bin", "next");
const port = process.env.PORT || "3000";
const dev = process.argv.includes("--dev");

// Private IPv4 addresses; adapters of virtual machines/WSL are listed last.
const virtual = /vethernet|virtualbox|vmware|wsl|docker|vbox|loopback/i;
const score = (i) => (virtual.test(i.name) || i.address.startsWith("192.168.56.") ? 2 : /wi-?fi|wlan|wireless/i.test(i.name) ? 0 : 1);
const addresses = Object.entries(networkInterfaces())
  .flatMap(([name, list]) => (list ?? []).map((i) => ({ name, ...i })))
  .filter((i) => i.family === "IPv4" && !i.internal && /^(192\.168|10|172\.(1[6-9]|2\d|3[01]))\./.test(i.address))
  .sort((a, b) => score(a) - score(b));

const urls = process.env.PUBLIC_URL
  ? [{ label: "Enlace público", url: process.env.PUBLIC_URL }]
  : addresses.map((a) => ({ label: a.name, url: `http://${a.address}:${port}` }));

function show() {
  console.log("\n=== Abre el prototipo en el móvil ===");
  if (!urls.length) console.log("No se ha encontrado una red local. Conéctate a una red Wi-Fi.");
  urls.forEach(({ label, url }, i) => {
    console.log(`\n${i === 0 ? "[Recomendada] " : ""}${label}: ${url}`);
    if (i === 0) qrcode.generate(url, { small: true });
  });
  if (!process.env.PUBLIC_URL) {
    console.log("\nEl móvil debe estar en la misma red Wi-Fi. Si no carga, permite Node.js en el cortafuegos de Windows (redes privadas).");
    console.log("Para usarlo fuera de la red: PUBLIC_URL=<url del túnel> npm run share\n");
  }
}

if (!dev) {
  const build = spawnSync(process.execPath, [next, "build"], { cwd: root, stdio: "inherit" });
  if (build.status !== 0) process.exit(build.status ?? 1);
}
show();
const server = spawn(process.execPath, [next, dev ? "dev" : "start", "-H", "0.0.0.0", "-p", port], { cwd: root, stdio: "inherit" });
server.on("exit", (code) => process.exit(code ?? 0));
process.on("SIGINT", () => server.kill("SIGINT"));
