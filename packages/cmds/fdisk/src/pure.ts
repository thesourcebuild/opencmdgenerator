/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/df/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { FdiskSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "fdisk" as const;

export function flagBool(spec: FdiskSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: FdiskSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: FdiskSpec, id: string, value: FlagValue | undefined): FdiskSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: FdiskSpec, patch: Record<string, FlagValue | undefined>): FdiskSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
