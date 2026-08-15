import type { ShellDialect } from "@cmdgen/contracts";
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { KillSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "kill" as const;

/** Common named signals, in the order most people reach for them. POSIX only — Stop-Process has no signal concept. */
export const COMMON_SIGNALS = ["TERM", "HUP", "INT", "QUIT", "KILL", "USR1", "USR2", "STOP", "CONT"] as const;

export function setSignal(spec: KillSpec, signal: string): KillSpec {
  return { ...spec, signal };
}

export function setTargets(spec: KillSpec, targets: readonly string[]): KillSpec {
  return { ...spec, targets: [...targets] };
}

export function flagBool(spec: KillSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: KillSpec, id: string, value: FlagValue | undefined): KillSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

/**
 * Maps the richer `KillPlatform` down to `@cmdgen/contracts`'s
 * `ShellDialect` for the generic render pipeline — `linux`/`mac` both mean
 * "posix" quoting; `windows-cygwin`/`windows-msys`/`windows-wsl` keep their
 * own distinct `ShellDialect` values for consistency with the rest of the
 * platform-family axis, even though (unlike ls) kill has no path arguments
 * for those dialects to matter to. See the identical helper in
 * @cmdgen/ls/pure.ts.
 */
export function toShellDialect(platform: KillSpec["platform"]): ShellDialect {
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
