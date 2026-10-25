import { readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/** A package and all its runtime dependencies, as tracing globs. */
function withDependencies(name: string, seen = new Set<string>()): string[] {
  if (seen.has(name)) return [];
  seen.add(name);
  const pkg = JSON.parse(readFileSync(path.join("node_modules", name, "package.json"), "utf8"));
  Object.keys(pkg.dependencies ?? {}).forEach((dep) => withDependencies(dep, seen));
  return [...seen].map((n) => `./node_modules/${n}/**/*`);
}

const nextConfig: NextConfig = {
  // Self-contained server for the Docker image (branch `local`); Vercel builds without it.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  // OCR runs on our own server (TRD §2b); keep tesseract.js out of the bundle.
  serverExternalPackages: ["tesseract.js"],
  // tesseract.js loads its worker, its WASM core and their dependencies (bmp-js, node-fetch…) at run time,
  // so the file tracer (Vercel and the Docker standalone build) cannot see them.
  outputFileTracingIncludes: {
    "/api/citation": withDependencies("tesseract.js"),
  },
  // Allow opening the dev server from a phone on the same Wi-Fi (TRD §2e).
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.16.*.*"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // The lawyer token travels in the URL (/abogado/[token]): never leak it to other sites.
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Microphone for dictation, camera for the citation photo; nothing else.
          { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=(), payment=(), usb=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
