/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/killall/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { WhereisSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "whereis" as const;

export function flagBool(spec: WhereisSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: WhereisSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: WhereisSpec, id: string, value: FlagValue | undefined): WhereisSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: WhereisSpec, patch: Record<string, FlagValue | undefined>): WhereisSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
