/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/chmod/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ChownSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "chown" as const;

export function flagBool(spec: ChownSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: ChownSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function flagEnum<T extends string>(spec: ChownSpec, id: string, allowed: readonly T[]): T | undefined {
  return generic.flagEnum(spec.flags, id, allowed);
}

export function setFlag(spec: ChownSpec, id: string, value: FlagValue | undefined): ChownSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
