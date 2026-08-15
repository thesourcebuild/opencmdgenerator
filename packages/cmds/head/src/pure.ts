/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/ls/pure` and for the same reason.
 */
import type { ShellDialect } from "@cmdgen/contracts";
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { HeadSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "head" as const;

export function flagBool(spec: HeadSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagNumber(spec: HeadSpec, id: string): number | undefined {
  const v = spec.flags[id];
  return typeof v === "number" ? v : undefined;
}

export function setFlag(spec: HeadSpec, id: string, value: FlagValue | undefined): HeadSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

/**
 * Collapses the 6-value `HeadPlatform` down to the 2-value axis flag
 * availability actually depends on — same idea as `@cmdgen/ls`'s `flagTag` /
 * `@cmdgen/whoami`'s `windowsFlagTag` / `@cmdgen/traceroute`'s
 * `platformFlagTag`. cygwin and msys invoke the exact same real `head`
 * binary as plain linux/mac and share the exact same flag set — only their
 * path *spelling* differs at render time, which stays keyed off
 * `spec.platform` itself via `toShellDialect` below, not this tag.
 */
export function flagTag(platform: HeadSpec["platform"]): "posix" | "powershell" {
  return platform === "windows-powershell" ? "powershell" : "posix";
}

/**
 * Maps the richer `HeadPlatform` down to `@cmdgen/contracts`'s
 * `ShellDialect` for the generic render pipeline — `linux`/`mac` both mean
 * "posix" quoting and path spelling; `windows-cygwin`/`windows-msys`/
 * `windows-wsl` keep their own distinct `ShellDialect` values so the
 * pipeline's Windows-path-to-bash conversion (see `HeadPlatform`'s doc
 * comment) fires correctly.
 */
export function toShellDialect(platform: HeadSpec["platform"]): ShellDialect {
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
