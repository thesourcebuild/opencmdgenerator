import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * A real "Target platform" axis (linux/mac/windows), mirroring `@cmdgen/ls`'s
 * `LsPlatform` shape: Linux and Mac render identically (both are plain POSIX
 * `tail`), and Windows further branches into WHICH shell will run the
 * command. Like ls's 4-way Windows split
 * (windows-powershell/windows-cygwin/windows-msys/windows-wsl), tail's
 * Windows split deliberately excludes a `windows-cmd` value entirely —
 * `tail` has no cmd.exe equivalent binary at all.
 *
 * `windows-cygwin`, `windows-msys`, and `windows-wsl` invoke the exact same
 * real `tail` binary with the exact same flags as `linux`/`mac` — unlike
 * `windows-powershell`'s `Get-Content -Wait`/`-Tail`, which is a genuinely
 * different program with an almost entirely disjoint flag set. They're still
 * distinct enum values (not folded into `linux`/`mac`) because
 * `toShellDialect` (in `pure.ts`) maps this richer platform down to
 * `@cmdgen/contracts`'s `ShellDialect` for rendering, and the generic render
 * pipeline needs to know specifically "cygwin", "msys", or "wsl" to rewrite a
 * "path"-role argument's Windows drive-letter/UNC spelling into that
 * dialect's own bash spelling (`C:\Data` → `/cygdrive/c/Data` under cygwin,
 * `/c/Data` under msys, `/mnt/c/Data` under wsl). Quoting itself is identical
 * bash-quoting for linux/mac/cygwin/msys/wsl alike (handled centrally in
 * `quoteFor`), and flag *availability* collapses all five back down to one
 * axis — see `flagTag` in `pure.ts`.
 */
export const TailPlatform = z.enum([
  "linux",
  "mac",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type TailPlatform = z.infer<typeof TailPlatform>;

export const TailSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  files: z.array(z.string()).default([]),
  platform: TailPlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type TailSpec = z.infer<typeof TailSpec>;
