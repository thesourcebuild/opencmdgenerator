import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * A real "Target platform" axis (linux/mac/windows), mirroring
 * `@cmdgen/mkdir`'s `MkdirPlatform` shape and `@cmdgen/ls`'s `LsPlatform`:
 * Linux and Mac render identically (both are plain POSIX `pwd`), and Windows
 * further branches into WHICH shell will run the command. Like ls's Windows
 * split, this is 4-way (windows-powershell/windows-cygwin/windows-msys/
 * windows-wsl) and deliberately excludes a `windows-cmd` value entirely —
 * cmd.exe's own "print the current directory" is a bare `cd` with no
 * arguments, a different command this app models separately, so there is no
 * cmd.exe equivalent binary for `pwd` at all.
 *
 * `windows-cygwin`, `windows-msys`, and `windows-wsl` invoke the exact same
 * real `pwd` builtin/behavior as `linux`/`mac` — unlike `windows-powershell`'s
 * `Get-Location`, which is a genuinely different program with no -L/-P
 * concept at all. They're still distinct enum values (not folded into
 * `linux`/`mac`) so that `toShellDialect` (in `pure.ts`) can map this richer
 * platform down to `@cmdgen/contracts`'s `ShellDialect` for rendering, same
 * as ls. Unlike ls, though, `pwd` takes no path arguments whatsoever, so
 * there is no Windows-path-vs-bash-path spelling concern here for the
 * generic render pipeline to resolve — cygwin/msys/wsl exist on this enum
 * purely to distinguish "this is a real bash shell" from "this is
 * PowerShell" for -L/-P flag availability, which `flagTag` below collapses
 * all five POSIX-ish values back down to `"posix"` for.
 */
export const PwdPlatform = z.enum(["linux", "mac", "windows-powershell", "windows-cygwin", "windows-msys", "windows-wsl"]);
export type PwdPlatform = z.infer<typeof PwdPlatform>;

export const PwdSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  platform: PwdPlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type PwdSpec = z.infer<typeof PwdSpec>;
