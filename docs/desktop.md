# Desktop shell

## Security posture of the desktop shell

- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`
- Renderer served over a custom `app://` scheme, not `file://`, giving it a real
  origin so a meaningful CSP and normal `localStorage` both work
- CSP set on every response: `default-src 'self'`, no `eval`, no remote origins
- Path traversal guard in the protocol handler
- Every IPC channel validates its arguments with Zod
- `saveTextFile` takes contents and a suggested name but never a path — the user
  chooses the destination through the OS dialog
- `openExternal` restricted to an allowlist; all navigation and `window.open`
  denied; `will-attach-webview` blocked

## Run this command (desktop, Windows and Linux)

The one deliberate exception to "generates commands, never executes them" —
scoped as tightly as the feature can usefully be while still doing what it says:

- **Populate, not auto-execute.** Run types the rendered command into a real
  shell prompt (`cmd.exe`, PowerShell, or WSL on Windows; `bash` on Linux —
  resolved from a closed enum to a hardcoded absolute path in `run.ts`, never a
  renderer-supplied path) and stops there. Nothing runs until the user presses
  Enter themselves.
- **Every Run — destructive-flagged or not — requires a confirmation modal**
  showing the literal final command text. Lint's `destructive` diagnostic level
  can't be trusted to catch every dangerous case across every command this app
  generates, so the confirmation doesn't rely on it as a gate.
- **All commands are in scope**, including `ssh`/`scp`. Once connected, that
  session is a live remote shell — none of this app's lint/confirmation
  machinery covers anything typed into it afterward. That's an accepted
  trade-off, not a gap being tracked.
- **Windows and Linux, not Mac (yet).** `node-pty` needs a real, per-OS native
  binary and a packaging target that actually rebuilds and ships it; Windows
  (`nsis`) and Linux (`AppImage`/`deb`) both have that in
  `electron-builder.config.cjs`. Mac does not — no `mac.target` build has ever
  exercised node-pty's native binary there, so `canRunCommands` stays `false`
  on that host until it does. Which specific dialects work on the *current*
  host (`cmd`/`powershell`/`wsl` on Windows, `bash` on Linux) is
  `PlatformEnvironment.runnableShellKinds` — a `wsl`-dialect command never
  shows as runnable on a Linux host, and vice versa for `bash`. The main
  process re-checks this itself (`shellKindsForThisHost()` in `run.ts`)
  rather than trusting the renderer's own gating.
- **`node-pty` is the one real runtime dependency** this app ships (see
  `apps/desktop/package.json`) — everything else is still fully bundled by
  tsup. `apps/desktop/src/main/run.ts` is the one file allowed to import it;
  ESLint enforces that scope everywhere else in the project.
