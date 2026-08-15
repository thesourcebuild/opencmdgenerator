/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mount/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { PatchSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "patch" as const;

export function flagBool(spec: PatchSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: PatchSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function flagNumber(spec: PatchSpec, id: string): number | undefined {
  return generic.flagNumber(spec.flags, id);
}

export function setFlag(spec: PatchSpec, id: string, value: FlagValue | undefined): PatchSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
