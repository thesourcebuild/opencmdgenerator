/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/ls/pure` and for the same reason.
 */
import type { ShellDialect } from "@cmdgen/contracts";
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { PwdSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "pwd" as const;

export function flagEnum<T extends string>(spec: PwdSpec, id: string, allowed: readonly T[]): T | undefined {
  return generic.flagEnum(spec.flags, id, allowed);
}

export function setFlag(spec: PwdSpec, id: string, value: FlagValue | undefined): PwdSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

/**
 * Collapses the 6-value `PwdPlatform` down to the 2-value axis flag
 * availability actually depends on — same idea as `@cmdgen/ls`'s `flagTag`.
 * cygwin, msys, and wsl run the exact same `pwd` builtin as linux/mac and
 * share the exact same flag set (there is no path spelling to worry about
 * here at all, unlike ls — see `PwdPlatform`'s doc comment).
 */
export function flagTag(platform: PwdSpec["platform"]): "posix" | "powershell" {
  return platform === "windows-powershell" ? "powershell" : "posix";
}

/**
 * Maps the richer `PwdPlatform` down to `@cmdgen/contracts`'s `ShellDialect`
 * for the generic render pipeline — `linux`/`mac` both mean "posix" quoting;
 * `windows-cygwin`/`windows-msys`/`windows-wsl` keep their own distinct
 * `ShellDialect` values for consistency with ls, even though `pwd` has no
 * path arguments for those dialects' spelling rules to ever act on.
 */
export function toShellDialect(platform: PwdSpec["platform"]): ShellDialect {
  switch (platform) {
    case "linux":
    case "mac":
      return "posix";
    case "windows-powershell":
      return "powershell";
    case "windows-cygwin":
      return "cygwin";
    case "windows-msys":
      return "msys";
    case "windows-wsl":
      return "wsl";
  }
}
