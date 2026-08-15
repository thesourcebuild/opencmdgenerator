/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mount/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { FindSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "find" as const;

export function flagBool(spec: FindSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: FindSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function flagNumber(spec: FindSpec, id: string): number | undefined {
  return generic.flagNumber(spec.flags, id);
}

export function flagEnum<T extends string>(spec: FindSpec, id: string, allowed: readonly T[]): T | undefined {
  return generic.flagEnum(spec.flags, id, allowed);
}

export function setFlag(spec: FindSpec, id: string, value: FlagValue | undefined): FindSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
