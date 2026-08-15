/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/whereis/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { WhichSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "which" as const;

export function flagBool(spec: WhichSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: WhichSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: WhichSpec, id: string, value: FlagValue | undefined): WhichSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: WhichSpec, patch: Record<string, FlagValue | undefined>): WhichSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
