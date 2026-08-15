/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/df/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { DuSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "du" as const;

export function flagBool(spec: DuSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: DuSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function flagNumber(spec: DuSpec, id: string): number | undefined {
  return generic.flagNumber(spec.flags, id);
}

export function setFlag(spec: DuSpec, id: string, value: FlagValue | undefined): DuSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: DuSpec, patch: Record<string, FlagValue | undefined>): DuSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
