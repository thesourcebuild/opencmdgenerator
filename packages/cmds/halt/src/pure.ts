/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/sudo/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { HaltSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "halt" as const;

export function flagBool(spec: HaltSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: HaltSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: HaltSpec, id: string, value: FlagValue | undefined): HaltSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: HaltSpec, patch: Record<string, FlagValue | undefined>): HaltSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
