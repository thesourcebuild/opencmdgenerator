/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/chmod/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { PsSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "ps" as const;

export function flagBool(spec: PsSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: PsSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: PsSpec, id: string, value: FlagValue | undefined): PsSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: PsSpec, patch: Record<string, FlagValue | undefined>): PsSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
