import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * A real "Target platform" axis (linux/mac/windows), mirroring
 * `@cmdgen/mkdir`'s `MkdirPlatform` shape: Linux and Mac render identically
 * (both are plain POSIX `rm`), and Windows further branches into WHICH
 * shell will run the command. Unlike mkdir's 2-way Windows split
 * (windows-cmd/windows-powershell), rm's Windows split is 4-way
 * (windows-powershell/windows-cygwin/windows-msys/windows-wsl) and
 * deliberately excludes a `windows-cmd` value entirely — `rm` has no cmd.exe
 * equivalent binary at all (`del`/`rd` are different tools this app never
 * generates).
 *
 * `windows-cygwin`, `windows-msys`, and `windows-wsl` invoke the exact same
 * real `rm` binary with the exact same flags as `linux`/`mac` — unlike
 * `windows-powershell`'s `Remove-Item`, which is a genuinely different
 * program with an almost entirely disjoint flag set (`rm -rf` fails outright
 * under the alias). They're still distinct enum values (not folded into
 * `linux`/`mac`) because `toShellDialect` (in `pure.ts`) maps this richer
 * platform down to `@cmdgen/contracts`'s `ShellDialect` for rendering, and
 * the generic render pipeline needs to know specifically "cygwin", "msys", or
 * "wsl" to rewrite a "path"-role argument's Windows drive-letter/UNC spelling
 * into that dialect's own bash spelling (`C:\Data` → `/cygdrive/c/Data` under
 * cygwin, `/c/Data` under msys, `/mnt/c/Data` under wsl). Quoting itself is
 * identical bash-quoting for linux/mac/cygwin/msys/wsl alike (handled
 * centrally in `quoteFor`), and flag *availability* collapses all five back
 * down to one axis — see `flagTag` in `pure.ts`.
 */
export const RmPlatform = z.enum([
  "linux",
  "mac",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type RmPlatform = z.infer<typeof RmPlatform>;

export const RmSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** No default — unlike ls's empty-means-cwd, rm has no sensible default target. */
  paths: z.array(z.string()).default([]),
  platform: RmPlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type RmSpec = z.infer<typeof RmSpec>;
