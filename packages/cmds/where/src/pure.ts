/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/which/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { WhereSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "where" as const;

export function flagBool(spec: WhereSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: WhereSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: WhereSpec, id: string, value: FlagValue | undefined): WhereSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: WhereSpec, patch: Record<string, FlagValue | undefined>): WhereSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
