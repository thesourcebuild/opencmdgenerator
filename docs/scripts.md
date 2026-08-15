# Scripts

Windows wrappers in [`scripts/`](../scripts/). Each is a `.ps1` with a matching `.bat`
that forwards to it with `-ExecutionPolicy Bypass`, so they work on machines where
running scripts is restricted by policy. Use either. Every script parses under both
PowerShell 7 and 5.1, since the `.bat` falls back to `powershell.exe` when `pwsh` is
absent.

The folder is grouped by purpose:

- `scripts/build-helpers/` — `build_*` wrappers (web, desktop, all)
- `scripts/launch/` — `launch_*` wrappers (dev servers and the desktop app)
- `scripts/package/` — `create-package` (the release) and `make_icon`
- `scripts/lib/common.ps1` — shared helpers, dot-sourced by every script; it neither
  launches nor builds anything itself
- `scripts/check_scripts.ps1` — the ASCII + parse gate, run by `create-package -Verify`

## Building

```bat
scripts\build-helpers\build_web.bat                       static export to apps/web/out
scripts\build-helpers\build_web.bat -Clean                fresh build, bypassing the turbo cache
scripts\build-helpers\build_web.bat -Serve                build, then serve it for a look

scripts\build-helpers\build_desktop.bat                   web export + renderer copy + main bundle
scripts\build-helpers\build_desktop.bat -Clean -Smoke     fresh build, then verify it loads
scripts\build-helpers\build_desktop.bat -Package          also build the setup .exe
scripts\build-helpers\build_desktop.bat -Package -Arch x64,arm64

scripts\build-helpers\build_all.bat                       both
scripts\build-helpers\build_all.bat -Clean -Verify -Smoke release build with the full gate
scripts\build-helpers\build_all.bat -Verify -Package      gate, build, then the setup .exe
```

**Building the setup:** add `-Package` to either script. Both hand off to
`create-package.ps1`, so there is one packaging path and the installer always lands
in `dist/<version>/` with a checksum beside it. Use `create-package.bat` directly
when you want the web zip and `RELEASE.md` as well.

`build_web` builds only the web app. `build_desktop` builds the web export too,
because it genuinely needs it — the renderer copy reads `apps/web/out`. All three go
through Turborepo with a dependency filter so that order is enforced rather than
coincidental.

`-Verify` runs tests, typecheck and lint *before* building and stops on failure, so
a broken tree never produces artifacts that look shippable. `-Clean` deletes output
and passes `--force`, because Turborepo would otherwise restore what was just
deleted straight out of its cache.

Each build prints what it produced and where, rather than only saying "success".
After `-Package` it names the installers specifically — the release directory also
contains `win-unpacked` and build intermediates, so its total size is mostly the
unpacked Electron runtime and tells you nothing useful.

## Packaging for release

Three modes. `-Release` is source plus binary, and is the default when none is given.

```bat
scripts\package\create-package.bat -Release -Verify     everything, behind the quality gate
scripts\package\create-package.bat -Source              source archive only (seconds)
scripts\package\create-package.bat -Binary              web zip + installer
scripts\package\create-package.bat -Release -Zip        also produce one archive of the whole release
scripts\package\create-package.bat -Binary -Arch x64,arm64
```

Output lands in `dist/<version>/`, where `<version>` comes from the **`version` file
at the repo root** — that file, not any package.json, is the single source of truth.
`create-package.ps1` also syncs the `version` field into the root, `apps/desktop` and
`apps/web` package.json files, so pnpm metadata and the packaged app's
`app.getVersion()` never drift from it. To bump the version, edit the `version`
file; everything downstream follows.

| File | Mode | What it is |
|---|---|---|
| `OpenCmdGenerator-<version>-source.zip` | source | buildable tree — `pnpm install && pnpm build` |
| `OpenCmdGenerator-web-<version>.zip` | binary | the static site, `index.html` at the archive root |
| `OpenCmdGenerator-setup-<version>-x64.exe` | binary | Windows installer, per-user, no admin needed |
| `OpenCmdGenerator-setup-<version>-x64.exe.blockmap` | binary | differential-update map, pairs with the installer |
| `SHA256SUMS.txt` | all | `sha256sum -c` compatible, so recipients can verify |
| `RELEASE.md` | all | generated from what was actually built, explains each file |

The source archive prefers `git archive` — "the files git tracks" needs no exclusion
list to maintain. Without a git repo it falls back to a filtered copy that prunes
`node_modules`, `dist`, `out`, `.next`, `renderer`, `release`, `.turbo`, `graphify-out`
and `*.tsbuildinfo`. It is written before anything is built, so build output cannot leak
in even if that list is ever wrong.

That folder is the deliverable — copy it, upload it, or attach it to a release.

`build_*` produces build output in the tree; `create-package` collects it into
something shareable. electron-builder runs in a staging directory under `TEMP`
rather than in the repo, because its output also includes `win-unpacked` — hundreds
of megabytes of unpacked Electron runtime that must not reach a recipient. Only the
installer and its `.blockmap` are copied out.

Checksums are not decoration here: the installer is unsigned (see below), so a
SHA-256 hash is the only way someone can confirm they got what you built.

## Launching

```bat
scripts\launch\launch_web.bat              dev server on http://localhost:3000
scripts\launch\launch_web.bat -Port 4000   another port
scripts\launch\launch_web.bat -Open        open a browser once it is listening
scripts\launch\launch_web.bat -Prod        build the static export and serve it

scripts\launch\launch_desktop.bat          dev: starts the web server, waits, runs Electron
scripts\launch\launch_desktop.bat -Prod    build and run the real app over app://
scripts\launch\launch_desktop.bat -Smoke   headless check that the bundle loads
scripts\launch\launch_desktop.bat -NoWeb   reuse a dev server that is already running
```

`launch_desktop.bat` with no arguments is the one to use day to day. It handles the part
that is easy to get wrong: Electron must not load its dev URL before Next is
listening, or it renders a connection error and never retries. The script starts
the dev server in its own window, waits for the port to accept connections, then
launches Electron — and kills the server tree on exit. If a server is already on
the port it reuses it instead of starting a second one.

Every launcher scrubs the leaked VS Code environment variables described in
[`docs/development.md`](development.md) before spawning anything.
