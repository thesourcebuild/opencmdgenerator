/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/grep/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { TracerouteSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "traceroute" as const;

export function flagBool(spec: TracerouteSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: TracerouteSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: TracerouteSpec, id: string, value: FlagValue | undefined): TracerouteSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

/**
 * Collapses the 7-value `TraceroutePlatform` down to the 2-value axis flag
 * availability actually depends on — same idea as whoami's `windowsFlagTag`.
 * windows-cmd and windows-powershell both invoke the one real tracert.exe
 * and share the exact same flag set; windows-cygwin, windows-msys and
 * windows-wsl are genuine bash environments running the real traceroute
 * binary, so they're tagged "posix" right alongside linux/mac instead.
 */
export function platformFlagTag(platform: TracerouteSpec["platform"]): "posix" | "windows" {
  return platform === "windows-cmd" || platform === "windows-powershell" ? "windows" : "posix";
}
