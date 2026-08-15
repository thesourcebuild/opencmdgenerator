/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/touch/pure` and `@cmdgen/killall/pure`, for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { RpmSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "rpm" as const;

export function flagBool(spec: RpmSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: RpmSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: RpmSpec, id: string, value: FlagValue | undefined): RpmSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: RpmSpec, patch: Record<string, FlagValue | undefined>): RpmSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
