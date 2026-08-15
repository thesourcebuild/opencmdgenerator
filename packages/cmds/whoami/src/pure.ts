/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mv/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { WhoamiSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "whoami" as const;

export function flagBool(spec: WhoamiSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: WhoamiSpec, id: string, value: FlagValue | undefined): WhoamiSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

/**
 * Collapses the 6-value `WhoamiPlatform` down to the 2-value axis flag
 * availability actually depends on. Only `windows-cmd`/`windows-powershell`
 * get the Windows-only flags — `windows-cygwin`/`windows-msys`/`windows-wsl`
 * are tagged `"posix"` right alongside the plain `posix` value, since a
 * Cygwin/MSYS2/WSL bash session expects the bare invocation, not
 * `/ALL`/`/GROUPS`/`/PRIV`.
 */
export function windowsFlagTag(platform: WhoamiSpec["platform"]): "posix" | "windows" {
  return platform === "windows-cmd" || platform === "windows-powershell" ? "windows" : "posix";
}
