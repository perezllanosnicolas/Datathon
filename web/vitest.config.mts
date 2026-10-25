import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      // "server-only" throws outside a React Server Component build; tests run server code directly.
      "server-only": path.resolve(import.meta.dirname, "tests/stubs/server-only.ts"),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    // A throwaway SQLite file per run, never the demo database.
    env: { DB_PATH: path.join(import.meta.dirname, ".vitest", "test.db") },
  },
});
