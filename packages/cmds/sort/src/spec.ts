import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * A real "Target platform" axis (linux/mac/windows), mirroring
 * `@cmdgen/ls`'s `LsPlatform` shape: Linux and Mac render identically (both
 * are plain GNU `sort`), and Windows further branches into WHICH shell will
 * run the command. Like ls's Windows split, sort's Windows split is 4-way
 * (windows-cmd/windows-cygwin/windows-msys/windows-wsl) — but unlike ls's
 * split, the non-cygwin/msys/wsl Windows sub-choice here is `windows-cmd`,
 * not `windows-powershell`: cmd.exe's `sort` is a simple, real builtin that
 * matches the `windows-cmd` value directly. PowerShell's `Sort-Object` is
 * deliberately NOT modeled here at all (not even as an excluded sibling
 * value the way ls excludes `windows-cmd`): it sorts objects piped into it
 * (`Get-Content file | Sort-Object`), a fundamentally different two-command
 * invocation shape every other command here avoids taking on.
 *
 * `windows-cygwin`, `windows-msys`, and `windows-wsl` invoke the exact same
 * real GNU `sort` binary with the exact same flags as `linux`/`mac` — unlike
 * `windows-cmd`'s builtin, a genuinely different, much simpler program with
 * an almost entirely disjoint flag set. They're still distinct enum values
 * (not folded into `linux`/`mac`) because `toShellDialect` (in `pure.ts`)
 * maps this richer platform down to `@cmdgen/contracts`'s `ShellDialect` for
 * rendering, and the generic render pipeline needs to know specifically
 * "cygwin", "msys", or "wsl" to rewrite a "path"-role argument's Windows
 * drive-letter/UNC spelling into that dialect's own bash spelling
 * (`C:\Data` → `/cygdrive/c/Data` under cygwin, `/c/Data` under msys,
 * `/mnt/c/Data` under wsl). Quoting itself is identical bash-quoting for
 * linux/mac/cygwin/msys/wsl alike (handled centrally in `quoteFor`), and
 * flag *availability* collapses all five back down to one axis — see
 * `flagTag` in `pure.ts`.
 */
export const SortPlatform = z.enum([
  "linux",
  "mac",
  "windows-cmd",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type SortPlatform = z.infer<typeof SortPlatform>;

export const SortSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  files: z.array(z.string()).default([]),
  platform: SortPlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type SortSpec = z.infer<typeof SortSpec>;
