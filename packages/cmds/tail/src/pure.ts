/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/head/pure` and for the same reason.
 */
import type { ShellDialect } from "@cmdgen/contracts";
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { TailSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "tail" as const;

export function flagBool(spec: TailSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagNumber(spec: TailSpec, id: string): number | undefined {
  const v = spec.flags[id];
  return typeof v === "number" ? v : undefined;
}

export function setFlag(spec: TailSpec, id: string, value: FlagValue | undefined): TailSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

/**
 * Collapses the 6-value `TailPlatform` down to the 2-value axis flag
 * availability actually depends on — same idea as `@cmdgen/whoami`'s
 * `windowsFlagTag` / `@cmdgen/traceroute`'s `platformFlagTag` / `@cmdgen/ls`'s
 * `flagTag`. cygwin, msys, and wsl invoke the exact same real `tail` binary
 * as plain posix and share the exact same flag set — only their path
 * *spelling* differs at render time, which stays keyed off `spec.platform`
 * itself via `toShellDialect` below (see `TailPlatform`'s doc comment), not
 * this tag.
 */
export function flagTag(platform: TailSpec["platform"]): "posix" | "powershell" {
  return platform === "windows-powershell" ? "powershell" : "posix";
}

/**
 * Maps the richer `TailPlatform` down to `@cmdgen/contracts`'s `ShellDialect`
 * for the generic render pipeline — `linux`/`mac` both mean "posix" quoting
 * and path spelling; `windows-cygwin`/`windows-msys`/`windows-wsl` keep their
 * own distinct `ShellDialect` values so the pipeline's Windows-path-to-bash
 * conversion (see `TailPlatform`'s doc comment) fires correctly.
 */
export function toShellDialect(platform: TailSpec["platform"]): ShellDialect {
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
