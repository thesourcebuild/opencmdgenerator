import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * A real "Target platform" axis (linux/mac/windows), mirroring
 * `@cmdgen/ls`'s `LsPlatform` shape: Linux and Mac render identically (both
 * are plain POSIX `diff`), and Windows further branches into WHICH shell will
 * run the command. Like ls's Windows split, diff's is 4-way
 * (windows-cmd/windows-cygwin/windows-msys/windows-wsl) — but unlike ls (which
 * excludes `windows-cmd` because there's no cmd.exe equivalent to `ls` at
 * all), diff's split lands on `windows-cmd` instead of `windows-powershell`:
 * cmd.exe's `fc` is a real builtin that matches this value directly, while
 * PowerShell's `Compare-Object` is deliberately never modeled here — it needs
 * a piped `Get-Content` to feed it, a fundamentally different two-command
 * invocation shape from every other value on this axis.
 *
 * `windows-cygwin`, `windows-msys` and `windows-wsl` invoke the exact same
 * real GNU `diff` binary with the exact same flags as `linux`/`mac` — unlike
 * `windows-cmd`'s `fc`, a genuinely different, much simpler program with an
 * entirely disjoint flag set (`/C`, `/N`, `/A`, `/B`). They're still distinct
 * enum values (not folded into `linux`/`mac`) because `toShellDialect` (in
 * `pure.ts`) maps this richer platform down to `@cmdgen/contracts`'s
 * `ShellDialect` for rendering, and the generic render pipeline needs to know
 * specifically "cygwin", "msys" or "wsl" to rewrite a "path"-role argument's
 * Windows drive-letter/UNC spelling into that dialect's own bash spelling
 * (`C:\Data` → `/cygdrive/c/Data` under cygwin, `/c/Data` under msys,
 * `/mnt/c/Data` under wsl). Quoting itself is identical bash-quoting for
 * linux/mac/cygwin/msys/wsl alike (handled centrally in `quoteFor`), and flag
 * *availability* collapses all five back down to one axis — see `flagTag` in
 * `pure.ts`.
 */
export const DiffPlatform = z.enum([
  "linux",
  "mac",
  "windows-cmd",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type DiffPlatform = z.infer<typeof DiffPlatform>;

export const DiffSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** diff takes exactly two operands, never an arbitrary list — same shape as `@cmdgen/ln`'s target/linkName. */
  file1: z.string().default(""),
  file2: z.string().default(""),
  platform: DiffPlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type DiffSpec = z.infer<typeof DiffSpec>;
