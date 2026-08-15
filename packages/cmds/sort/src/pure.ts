/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/ls/pure` and for the same reason.
 */
import type { ShellDialect } from "@cmdgen/contracts";
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { SortSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "sort" as const;

export function flagBool(spec: SortSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: SortSpec, id: string, value: FlagValue | undefined): SortSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

/**
 * Collapses the 6-value `SortPlatform` down to the 2-value axis flag
 * availability actually depends on — same idea as `@cmdgen/ls`'s `flagTag` /
 * `@cmdgen/whoami`'s `windowsFlagTag` / `@cmdgen/traceroute`'s
 * `platformFlagTag`. cygwin, msys, and wsl invoke the exact same real GNU
 * `sort` binary as linux/mac and share the exact same flag set — only their
 * path *spelling* differs at render time, which stays keyed off
 * `spec.platform` itself via `toShellDialect` below, not this tag.
 */
export function flagTag(platform: SortSpec["platform"]): "posix" | "cmd" {
  return platform === "windows-cmd" ? "cmd" : "posix";
}

/**
 * Maps the richer `SortPlatform` down to `@cmdgen/contracts`'s
 * `ShellDialect` for the generic render pipeline — `linux`/`mac` both mean
 * "posix" quoting and path spelling; `windows-cygwin`/`windows-msys`/
 * `windows-wsl` keep their own distinct `ShellDialect` values so the
 * pipeline's Windows-path-to-bash conversion (see `SortPlatform`'s doc
 * comment) fires correctly.
 */
export function toShellDialect(platform: SortSpec["platform"]): ShellDialect {
  switch (platform) {
    case "linux":
    case "mac":
      return "posix";
    case "windows-cmd":
      return "cmd";
    case "windows-cygwin":
      return "cygwin";
    case "windows-msys":
      return "msys";
    case "windows-wsl":
      return "wsl";
  }
}
