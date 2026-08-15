# Creating a Good Issue

Found a bug or have a feature request? Here's how to write a useful issue for
OpenCmdGenerator.

## Before posting

- Search the tracker for an existing issue first.
- Test against the latest version (the `version` file at the repo root is the
  single source of truth).
- Narrow the scope yourself: which command, which shell, which platform? A report
  that already isolates the problem is fixed fast; one that describes it is
  guessed at.

## The most useful thing you can paste

The generated command itself, plus how it was produced. That single block is what
lets someone reproduce your exact output without rebuilding your flags by trial
and error.

## Bug report template

```
### Description
What went wrong?

### The command
- Command: rsync / curl / openssl / ...
- Flags selected: (e.g. `rsync -av --delete`, or the preset you used)
- Target shell: POSIX (bash) / cmd.exe / PowerShell
- Target platform: (only if the command has a target selector, e.g. rsync on
  Windows: cwRsync / MSYS2 / WSL)
- Rendered output:
  <paste the exact generated command here>

### Expected behavior
What the command should have looked like.

### Environment
- OS: Windows 11 / Ubuntu 24.04 / macOS ...
- App: web (which browser) or desktop (installed copy, or dev build)
- Version: (from the `version` file at the repo root)

### Attachments (optional)
- A screenshot of the builder with the failing flags.
- The diagnostic message and its rule code, if the lint panel complained.
```

## Feature request template

```
### Problem
What's missing or inconvenient?

### Proposed solution
How would you like it to work?

### Command coverage
Which command(s) does this apply to, and on which shells/platforms?

### Alternatives considered
Any other approaches you've thought about.
```

## A good issue includes

- The **exact flags** you picked, not a paraphrase
- The **target shell and platform** — quoting and syntax differ per shell, and some
  commands have real per-platform dialects beyond quoting (see the target
  selectors)
- The **rendered output**, pasted verbatim
- Whether it happens in **web, desktop, or both** (the desktop adds the Run
  feature and native dialogs; the web build cannot touch the filesystem)
- For diagnostics: the **rule code** shown in the lint panel, so the fix can be
  targeted

If the generated command looks wrong, sanity-check it against the real tool's
`--help` before filing — the ground-truth verifiers do exactly that (see
[docs/development.md](development.md)).

Well-written issues get fixed faster.
