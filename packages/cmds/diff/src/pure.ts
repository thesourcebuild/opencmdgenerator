/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/ls/pure` and for the same reason.
 */
import type { ShellDialect } from "@cmdgen/contracts";
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { DiffSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "diff" as const;

export function flagBool(spec: DiffSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: DiffSpec, id: string, value: FlagValue | undefined): DiffSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

/**
 * Collapses the 6-value `DiffPlatform` down to the 2-value axis flag
 * availability actually depends on — same idea as `@cmdgen/whoami`'s
 * `windowsFlagTag` / `@cmdgen/traceroute`'s `platformFlagTag` / `@cmdgen/ls`'s
 * `flagTag` / `@cmdgen/head`'s `flagTag`. cygwin, msys and wsl invoke the
 * exact same real GNU `diff` binary as plain posix and share the exact same
 * flag set — only their path *spelling* differs at render time, which stays
 * keyed off `spec.platform` itself via `toShellDialect` below, not this tag.
 */
export function flagTag(platform: DiffSpec["platform"]): "posix" | "cmd" {
  return platform === "windows-cmd" ? "cmd" : "posix";
}

/**
 * Maps the richer `DiffPlatform` down to `@cmdgen/contracts`'s `ShellDialect`
 * for the generic render pipeline — `linux`/`mac` both mean "posix" quoting
 * and path spelling; `windows-cygwin`/`windows-msys`/`windows-wsl` keep their
 * own distinct `ShellDialect` values so the pipeline's Windows-path-to-bash
 * conversion (see `DiffPlatform`'s doc comment) fires correctly.
 */
export function toShellDialect(platform: DiffSpec["platform"]): ShellDialect {
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
