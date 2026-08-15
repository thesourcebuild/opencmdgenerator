import { z } from "zod";

/**
 * Which shell the generated command text will be pasted into. `cmd` is
 * cmd.exe — a real, distinct dialect (own quoting rules, own line-
 * continuation character), not merely "Windows" as a whole; PowerShell is
 * Windows too. Only commands whose generated output is a plain argv .exe
 * that runs unchanged from any shell (ssh, scp, tar, rsync) offer it — see
 * each command's own manifest `shells` claim. ls/rm/kill deliberately do NOT
 * reuse this type for their own platform field (they define their own
 * narrower `z.enum(["posix","powershell"])`) since they have no cmd.exe
 * equivalent binary at all.
 *
 * `cygwin`, `msys` and `wsl` are real bash shells that happen to run on
 * Windows — they quote exactly like `posix` (same bash rules), so `quoteFor`
 * treats them identically to it. The one thing that genuinely differs is
 * path spelling: a Windows drive-letter or UNC path has to be rewritten
 * before a bash running under one of them can use it (`C:\Data` becomes
 * `/cygdrive/c/Data` under Cygwin, `/c/Data` under MSYS2, `/mnt/c/Data` under
 * WSL) — the generic render pipeline (`renderTokens` in `@cmdgen/engine`)
 * does this automatically for any "path"-role argument once `shell` is one
 * of these three values, via `toBashPath`. This is a DIFFERENT axis from
 * rsync/scp's own `PathFlavor` below: `PathFlavor` picks which *rsync/scp
 * build* will run (and what path spelling *that program* needs), while
 * `shell` picks which terminal the user is pasting the whole command line
 * into — you can be typing into an MSYS2 terminal while still targeting a
 * WSL-hosted rsync, so the two are orthogonal, not the same picker.
 */
export const ShellDialect = z.enum(["posix", "cmd", "powershell", "cygwin", "msys", "wsl"]);
export type ShellDialect = z.infer<typeof ShellDialect>;

/**
 * How paths must be spelled for the build of the target tool that will run
 * the command. Only rsync uses more than "unix" today — Windows has no native
 * rsync, so a drive-letter path has to be rewritten depending on which rsync
 * distribution will run it (cygwin -> /cygdrive/c/..., msys -> /c/...,
 * wsl -> /mnt/c/...). Lives here rather than in packages/cmds/rsync because
 * the platform bridge needs a sensible per-OS default before any command is
 * even selected; it can move to a narrower home once a second command needs
 * different path semantics than rsync's.
 */
export const PathFlavor = z.enum(["unix", "cygwin", "msys", "wsl"]);
export type PathFlavor = z.infer<typeof PathFlavor>;
