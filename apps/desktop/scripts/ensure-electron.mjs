/* eslint-disable no-restricted-imports */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

/**
 * Ensures the Electron binary is on disk before the dev watchers start.
 *
 * electron 43 ships no postinstall script — the binary is downloaded lazily the
 * first time something `require("electron")`s it. tsup's array config runs main
 * and preload as two parallel watchers, and each one's `--onSuccess` fires this
 * project's `run-electron.mjs`, which imports electron. On a fresh checkout both
 * watchers trigger the download at once and race each other extracting into the
 * same `dist/` directory (EBUSY spawns and locked `default_app.asar` failures).
 *
 * `install.js` is idempotent (it exits immediately when the right version is
 * already on disk), so running it here, once, serializes the download ahead of
 * any watcher. The `dev` script runs this before tsup starts.
 */
const require = createRequire(import.meta.url);
const electronPkg = path.dirname(require.resolve("electron/package.json"));

process.stdout.write("Verifying Electron binary...\n");
const result = spawnSync(process.execPath, [path.join(electronPkg, "install.js")], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);