# OpenCmdGenerator

Build shell commands with confidence. OpenCmdGenerator turns command-line references
into a fast visual workspace for composing, validating, and explaining the exact
command you need.

 It covers **200+** commands across Windows, Linux, and macOS, with platform-aware
 rendering for POSIX(bash/zsh), PowerShell, Command Prompt, MSYS2, and Cygwin - plus presets
 and live previews across **web** and **desktop**.

See [Security](#security) for the execution policy and the desktop Run exception.

## Requirements

- **Node 22.13+** (developed against 24.18)
- **pnpm 11.x** — pinned via `packageManager`. Install 'pnpm' if you have not done already:
  `npm install -g pnpm@11`

## Setup

```bat
:: install the workspace
pnpm install        

:: Next dev server on http://localhost:3000
pnpm web            

:: Electron against the dev server — start `pnpm web` first
:: or use scripts\launch\launch_desktop.bat which starts the web :: server and waits for it
pnpm desktop        
```

First-run sanity check: `pnpm typecheck` && `pnpm lint` && `pnpm test`.

For the Windows `scripts\*\*.bat` launchers and the full command table, see
[docs/scripts.md](docs/scripts.md) and
[docs/development.md](docs/development.md).

## Packaging

Use the packaging scripts when you want release artifacts instead of a dev run:

- `pnpm build` - build the web export and the desktop bundle
- `pnpm package` - create the Windows installer release flow
- `scripts\build-helpers\build_all.bat -Verify -Package` - full checked build plus installer
- `scripts\package\create-package.bat -Binary` - web zip + desktop installer
- `scripts\package\create-package.bat -Release -Zip` - full release folder plus archive

The package version comes from the root `version` file, and the release output is
written under `dist/<version>/`.

See [docs/scripts.md](docs/scripts.md) for the full build/package/launch matrix.

## Security

This app generates commands. It does not execute them, and it has no backend or
daemon. The ESLint config enforces that: importing `child_process` anywhere in
the project is an error.

The one deliberate exception is the desktop app on Windows or Linux, where a
"Run" button can open a real interactive shell (`node-pty`) and type the
generated command into it. It never auto-executes, it always requires a
confirmation modal, and it is unavailable in the browser build. Exactly one file,
`apps/desktop/src/main/run.ts`, is allowed to do this; ESLint enforces that scope
too, and `node-pty` is banned everywhere else in the project, including the rest
of the Electron main process. See [docs/desktop.md](docs/desktop.md) for the
full desktop-shell security posture.

## Why that shapes everything

The web app and the desktop app are the *same static bundle*. `apps/web` produces
`out/`; a browser loads it from a static host and Electron loads the identical
directory over its own `app://` protocol. There is one build of the UI, and the
platform adapter is chosen at runtime.

The shared engine lives in `packages/cmd-engine`: the generic flag catalogue,
argv builder, shell quoting, lint runner, and explainer that every command package
is built on top of. Each individual command (`rsync`, `curl`, `ssh`, `alias`, ...)
is its own package under `packages/cmds/`, following the same file-by-file shape.

## Layout

```
tests/                  the whole test suite, plus the rsync ground-truth verifier
scripts/                Windows launchers (.ps1 with .bat wrappers)
apps/
  web/                  Next.js, output: "export" — the single UI
  desktop/              Electron shell only, no UI code
    src/main/           lifecycle, app:// protocol, hardened window, IPC, store
    src/preload/        the entire contextBridge surface
    scripts/            dev launcher (sanitises the environment)
packages/
  contracts/            Zod schemas: shared spec primitives, diagnostics, PlatformApi
  cmd-engine/           catalogue · build · render · lint · explain · presets (generic)
  cmd-registry/         the sidebar's MANIFESTS list + per-command lazy loader
  cmds/                 one package per command (rsync, curl, ssh, alias, apt, ...)
  platform/             web.ts / electron.ts adapters, runtime-selected
  ui/                   shared primitives + Tailwind theme
  config/               shared tsconfig presets
```

## Further reading

- [docs/scripts.md](docs/scripts.md) — building, packaging and launching (the
  `scripts/*.bat` wrappers, `-Verify`/`-Clean`/`-Package`, the release archive)
- [docs/development.md](docs/development.md) — the pnpm command table, tests,
  ground truth, known footguns, generator safety
- [docs/desktop.md](docs/desktop.md) — security posture of the Electron shell and
  the "Run this command" feature

## Contributions

Contributions of all sizes are warmly welcome!. Please feel free to:

- Report issues using [the issue guide](docs/create_a_issue.md)
- Submit pull requests
- Improve documentation
- Suggest new features
- Start a discussion

Let's make the library better for everyone.

---

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE)
(`GPL-3.0-only`). See [LICENSE](LICENSE) for the full text.

---

## Author

Muhammad Hassaan Shah

- GitHub: [@thesourcebuild](https://github.com/thesourcebuild)
- Project: [github.com/thesourcebuild/OpenCmdGenerator](https://github.com/thesourcebuild/OpenCmdGenerator)
