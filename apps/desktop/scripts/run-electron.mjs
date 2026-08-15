/* eslint-disable no-restricted-imports */
import { spawn } from "node:child_process";
import electronPath from "electron";

/**
 * Launches Electron with a sanitised environment.
 *
 * VS Code's extension host exports ELECTRON_RUN_AS_NODE=1, and it leaks into the
 * integrated terminal. With it set, `electron .` silently runs as plain Node:
 * `require("electron")` returns a stub, so `protocol` and `BrowserWindow` are
 * undefined and the app dies before showing a window. Unsetting it here means
 * `pnpm dev` behaves the same inside and outside the editor.
 *
 * This is the one place in the project that spawns a process — it is a dev
 * launcher, not application code. The app itself only ever generates commands.
 */
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;
delete env.VSCODE_ESM_ENTRYPOINT;
delete env.VSCODE_IPC_HOOK;

/**
 * `--dev` means "load the Next dev server". The URL is only defaulted, never
 * forced, so a launcher can point at a different port by exporting
 * CMD_GENERATOR_DEV_URL. Production runs never pass --dev and never get a dev URL.
 */
const args = process.argv.slice(2);
const isDev = args.includes("--dev");
if (isDev && !env.CMD_GENERATOR_DEV_URL) env.CMD_GENERATOR_DEV_URL = "http://localhost:3000";

const child = spawn(electronPath, [".", ...args.filter((a) => a !== "--dev")], {
  stdio: "inherit",
  env,
});

child.on("close", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
