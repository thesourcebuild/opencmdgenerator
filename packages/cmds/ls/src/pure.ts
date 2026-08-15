import type { ShellDialect } from "@cmdgen/contracts";
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { LsSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "ls" as const;

export function flagBool(spec: LsSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagEnum<T extends string>(spec: LsSpec, id: string, allowed: readonly T[]): T | undefined {
  return generic.flagEnum(spec.flags, id, allowed);
}

export function setFlag(spec: LsSpec, id: string, value: FlagValue | undefined): LsSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: LsSpec, patch: Record<string, FlagValue | undefined>): LsSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}

/** Replaces `spec.flags` outright with `patch`, discarding whatever was set before. */
export function replaceFlags(spec: LsSpec, patch: Record<string, FlagValue | undefined>): LsSpec {
  return { ...spec, flags: generic.replaceFlags(patch) };
}

/**
 * Collapses the 5-value `LsPlatform` down to the 2-value axis flag
 * availability actually depends on — same idea as `@cmdgen/whoami`'s
 * `windowsFlagTag` / `@cmdgen/traceroute`'s `platformFlagTag`. cygwin and
 * msys invoke the exact same real `ls` binary as linux/mac and share the
 * exact same flag set — only their path *spelling* differs at render time,
 * which stays keyed off `spec.platform` itself via `toShellDialect` below,
 * not this tag.
 */
export function flagTag(platform: LsSpec["platform"]): "posix" | "powershell" {
  return platform === "windows-powershell" ? "powershell" : "posix";
}

/**
 * Maps the richer `LsPlatform` down to `@cmdgen/contracts`'s `ShellDialect`
 * for the generic render pipeline — `linux`/`mac` both mean "posix" quoting
 * and path spelling; `windows-cygwin`/`windows-msys`/`windows-wsl` keep their
 * own distinct `ShellDialect` values so the pipeline's Windows-path-to-bash
 * conversion (see `LsPlatform`'s doc comment) fires correctly.
 */
export function toShellDialect(platform: LsSpec["platform"]): ShellDialect {
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
