import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // OCR runs on our own server (TRD §2b); keep tesseract.js out of the bundle.
  serverExternalPackages: ["tesseract.js"],
  // Allow opening the dev server from a phone on the same Wi-Fi (TRD §2e).
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.16.*.*"],
};

export default nextConfig;
