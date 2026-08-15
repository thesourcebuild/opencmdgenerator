/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/touch/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { KillallSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "killall" as const;

export function flagBool(spec: KillallSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: KillallSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: KillallSpec, id: string, value: FlagValue | undefined): KillallSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: KillallSpec, patch: Record<string, FlagValue | undefined>): KillallSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
