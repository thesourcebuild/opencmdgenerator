/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/df/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { MkfsSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "mkfs" as const;

export function flagBool(spec: MkfsSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: MkfsSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: MkfsSpec, id: string, value: FlagValue | undefined): MkfsSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: MkfsSpec, patch: Record<string, FlagValue | undefined>): MkfsSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
