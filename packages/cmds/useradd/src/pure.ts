/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/touch/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { UseraddSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "useradd" as const;

export function flagBool(spec: UseraddSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: UseraddSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: UseraddSpec, id: string, value: FlagValue | undefined): UseraddSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: UseraddSpec, patch: Record<string, FlagValue | undefined>): UseraddSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
