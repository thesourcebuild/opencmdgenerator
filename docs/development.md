# Development

## Commands

| Command | What it does |
|---|---|
| `pnpm install` | Install the workspace |
| `pnpm test` | Vitest over [`tests/`](../tests/) (1454 tests) |
| `pnpm test:watch` | Same, in watch mode |
| `pnpm typecheck` | `tsc --noEmit` in every package, plus `tests/` |
| `pnpm lint` | ESLint across the monorepo |
| `pnpm build` | Web static export, then the desktop bundle |
| `pnpm web` | Next dev server on :3000 |
| `pnpm desktop` | Electron against the dev server (start `pnpm web` first), with HMR |
| `pnpm package` | electron-builder installers into `apps/desktop/release/` |
| `pnpm --filter @cmdgen/desktop smoke` | Headless check that the packaged renderer loads |
| `pnpm verify:rsync` | Feed generated commands to a real rsync (`verify:rsync:wsl` on Windows) |

### Tests

The whole suite lives in [`tests/`](../tests/) at the repo root and imports the shared
packages through their public entry points, so a dropped export fails the tests.
See [tests/README.md](../tests/README.md) for what each file covers and the
conventions expected of new tests.

### Ground truth

Exact-string tests prove the generator is self-consistent; they cannot prove rsync
accepts what it emits. `verify:rsync` runs each generated command through a real
rsync with `--dry-run` so its own option parser is the judge. Verified against
rsync 3.2.7 (protocol 31) via WSL — all cases accepted. Run this whenever the flag
catalogue changes.

The desktop build order is **web export → copy to `renderer/` → bundle main**.
`@cmdgen/web` is declared as a devDependency of `apps/desktop` purely so Turborepo
enforces that order; it is never imported.

## Things that will bite you

**`ELECTRON_RUN_AS_NODE`.** VS Code's extension host exports this, and it leaks
into the integrated terminal. With it set, `electron .` runs as plain Node,
`require("electron")` returns a stub, and the app dies with
`Cannot read properties of undefined (reading 'registerSchemesAsPrivileged')`.
`apps/desktop/scripts/run-electron.mjs` strips it, which is why every Electron
script goes through that launcher instead of calling `electron` directly.

**Electron's binary is downloaded lazily, and tsup races it.** electron 43 ships
no postinstall script — the binary is fetched the first time something
`require("electron")`s it. tsup's array config runs the main and preload bundles
as two parallel watchers, each firing `--onSuccess "node scripts/run-electron.mjs
--dev"`, so on a fresh checkout both triggered the download at once and raced each
other extracting into `node_modules/electron/dist` (EBUSY spawns and locked
`default_app.asar` failures). `apps/desktop/scripts/ensure-electron.mjs` runs
electron's idempotent `install.js` once before tsup starts (see the `dev` script
in `apps/desktop/package.json`), serializing the download. Run it manually if you
ever delete `node_modules/electron` mid-session.

**Extensionless relative imports.** The shared packages are consumed as TypeScript
source (no build step). Turbopack does not resolve `./foo.js` to `foo.ts`, so
relative imports omit the extension and rely on `moduleResolution: "bundler"`.

**`pnpm approve-builds`.** pnpm 10+ blocks postinstall scripts unless a package is
in the `allowBuilds` map in `pnpm-workspace.yaml` (pnpm 10 used the old
`onlyBuiltDependencies` list; pnpm 11 consolidated everything into
`allowBuilds`, and reads non-auth settings only from `pnpm-workspace.yaml`, not
`.npmrc`). `electron`, `esbuild`, `node-pty`, `@tailwindcss/oxide` and
`unrs-resolver` are allowed; `sharp` is deliberately `false` — the export sets
`images: { unoptimized: true }`, so it is never needed. Note pnpm 11 defaults
`strictDepBuilds` to `true`, so an unapproved build is a hard install error, and
a failed install appends `allowBuilds` placeholder entries to the workspace file
that you must clean up before retrying.

**Antivirus vs. electron-builder.** On managed Windows machines, real-time scanning
can hold a lock on the Electron binaries electron-builder extracts inside the
project tree, and packaging dies with
`EPERM: rename 'release\win-unpacked.tmp'`. Set `CMD_GENERATOR_RELEASE_DIR` to a path
outside the scanned tree, or add the project to the scanner's exclusions.

**Electron's version is pinned exactly** (`43.2.0`, not `^43.2.0`).
electron-builder downloads binaries for one specific release and refuses a range.

**Installers are not code-signed.** electron-builder logs
`signing with signtool.exe` during a Windows build, which reads as though signing
happened — it did not. No certificate is configured, so
`Get-AuthenticodeSignature` on the produced installer reports `NotSigned`, and
Windows SmartScreen will warn anyone who downloads it. Do not treat the log line
as evidence; check the signature.

## Generator safety

The output is text a user will paste into a shell, so quoting is a correctness
concern:

- POSIX and PowerShell quoting are implemented separately and tested against
  paths containing spaces, apostrophes, `$`, backticks, `!` and `;`
- `extraArgs` passthrough is allowlisted. `-e`, `--rsh` and `--rsync-path` are
  rejected outright — all three make rsync execute a program
- 26 lint rules classify problems as error / destructive / warning / info, most
  with a one-click fix. `--delete` always raises a destructive diagnostic and
  offers the dry-run variant
- Trailing-slash semantics are modelled as an explicit `contentsOnly` boolean and
  rendered as a before/after tree, not left to a character the user must notice
