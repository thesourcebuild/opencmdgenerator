import { defineConfig } from "vitest/config";

/**
 * One suite at the repo root, exercising every package — the 57 command packages
 * under `packages/cmds/` (`@cmdgen/rsync`, `@cmdgen/curl`, ...) plus the shared
 * `@cmdgen/engine`/`@cmdgen/contracts` — through its public entry point rather than
 * reaching into `src/`. That means the tests break if an export is dropped from a
 * package's index, which is exactly the contract the apps depend on.
 */
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    reporters: ["default"],
  },
});
