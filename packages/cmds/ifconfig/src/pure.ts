/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mv/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { IfconfigSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "ifconfig" as const;

export function flagBool(spec: IfconfigSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: IfconfigSpec, id: string, value: FlagValue | undefined): IfconfigSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

/**
 * Collapses the 7-value `IfconfigPlatform` down to the 2-value axis flag
 * availability actually depends on — same shape and purpose as
 * `@cmdgen/whoami`'s `windowsFlagTag`. windows-cmd and windows-powershell
 * share the exact same flag set, since both just invoke the one real
 * ipconfig.exe. windows-cygwin, windows-msys and windows-wsl are tagged
 * `"posix"` right alongside linux/mac, since a Cygwin/MSYS2/WSL bash session
 * invokes the real `ifconfig` binary with the real POSIX flags, not
 * ipconfig's.
 */
export function platformFlagTag(platform: IfconfigSpec["platform"]): "posix" | "windows" {
  return platform === "windows-cmd" || platform === "windows-powershell" ? "windows" : "posix";
}
