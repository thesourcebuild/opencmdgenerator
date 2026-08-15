/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/chmod/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { TouchSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "touch" as const;

export function flagBool(spec: TouchSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: TouchSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: TouchSpec, id: string, value: FlagValue | undefined): TouchSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: TouchSpec, patch: Record<string, FlagValue | undefined>): TouchSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
