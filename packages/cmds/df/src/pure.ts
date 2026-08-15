/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/touch/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { DfSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "df" as const;

export function flagBool(spec: DfSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: DfSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: DfSpec, id: string, value: FlagValue | undefined): DfSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: DfSpec, patch: Record<string, FlagValue | undefined>): DfSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
