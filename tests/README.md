# tests

The whole suite lives here, at the repo root, and imports every package —
`@cmdgen/rsync`, `@cmdgen/curl`, `@cmdgen/engine`, `@cmdgen/contracts`, and the
rest of the 57 command packages under `packages/cmds/` — through its public
entry point, never by reaching into `src/`. A dropped export therefore fails
the tests, which is the contract the two apps actually depend on.

```
pnpm test              run once
pnpm test:watch        watch mode
pnpm verify:rsync      ground truth against a real rsync
pnpm verify:rsync:wsl  same, via WSL (use this on Windows)
```

## Files

Every command gets its own `<name>.test.ts` (`curl.test.ts`, `alias.test.ts`,
`apt.test.ts`, ...) covering argv/render correctness, lint rules, presets and
`describeSpec` in one file — see `CLAUDE.md`'s "Adding a new command" section
for the exact pattern. `rsync` predates that one-file-per-command convention
and keeps its historically larger test surface split across a few files
instead, all carrying an `rsync-` prefix so they're not mistaken for
generic/shared tests:

| File | Covers |
|---|---|
| [rsync-fixtures.ts](rsync-fixtures.ts) | Shared spec builders — local, ssh and daemon endpoints |
| [rsync-argv.test.ts](rsync-argv.test.ts) | Spec → exact command. Flag ordering, enums, filter order, transports, path flavours, the passthrough allowlist, version gating, dry-run, multi-line rendering |
| [rsync-paths.test.ts](rsync-paths.test.ts) | Windows drive translation per rsync flavour, UNC, nesting detection |
| [rsync-lint.test.ts](rsync-lint.test.ts) | Catalogue integrity, and a positive plus negative case per rule |
| [verify-against-rsync.mjs](verify-against-rsync.mjs) | Ground truth — see below |

A few files are genuinely cross-command, not per-command:

| File | Covers |
|---|---|
| [quote.test.ts](quote.test.ts) | `@cmdgen/engine`'s shared POSIX/cmd/PowerShell quoting torture cases — used by every command, not just rsync |
| [registry.test.ts](registry.test.ts) | Repo-wide manifest checks: no duplicate ids, every manifest declares real platforms/shells |
| [curl-live.test.ts](curl-live.test.ts) | Live network verification — exercises every httpbingo.org preset against the real server when reachable, skips cleanly offline |

## Two kinds of checking, and why both are needed

The `.test.ts` files assert that a spec produces an **exact command string**.
They are literals rather than snapshots on purpose: when one changes, the diff
shows the command that changed instead of a hash. This catches regressions in
ordering, quoting and flag rendering.

What they cannot catch is a command that is self-consistently **wrong** — one this
project happily generates and rsync then rejects. That is what
`verify-against-rsync.mjs` is for: it feeds each generated command to a real rsync
with `--dry-run` and lets rsync's own option parser be the judge. Last verified
against rsync 3.2.7 (protocol 31), all cases accepted.

Run the verifier whenever the flag catalogue changes. It is the only check that
knows anything about the outside world.

## Rules for tests in here

- **No time, no randomness.** Fixtures use fixed ids so a failure reads the same
  on every run.
- **Every lint rule gets both cases** — one spec that trips it and one that does
  not. A rule that only ever fires is indistinguishable from a rule that always
  fires.
- **Every fix is applied and re-linted.** A `fix` that does not silence its own
  diagnostic is a bug, and asserting the fix works is the only way to notice.
- **The verifier never runs in CI by default** — it needs a real rsync. Treat it
  as a pre-merge check on catalogue changes.
