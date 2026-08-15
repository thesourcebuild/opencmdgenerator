/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/df/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { BlkidSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "blkid" as const;

export function flagBool(spec: BlkidSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: BlkidSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: BlkidSpec, id: string, value: FlagValue | undefined): BlkidSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: BlkidSpec, patch: Record<string, FlagValue | undefined>): BlkidSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
