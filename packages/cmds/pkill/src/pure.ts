/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/killall/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { PkillSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "pkill" as const;

export function flagBool(spec: PkillSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: PkillSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: PkillSpec, id: string, value: FlagValue | undefined): PkillSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: PkillSpec, patch: Record<string, FlagValue | undefined>): PkillSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}

/** Signal names/numbers that mean SIGKILL — used by the SIGKILL lint warning. */
export function isKillSignal(signal: string): boolean {
  const s = signal.trim().toUpperCase().replace(/^SIG/, "");
  return s === "KILL" || s === "9";
}
