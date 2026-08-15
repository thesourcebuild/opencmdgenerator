/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/touch/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { MountSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "mount" as const;

export function flagBool(spec: MountSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: MountSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: MountSpec, id: string, value: FlagValue | undefined): MountSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: MountSpec, patch: Record<string, FlagValue | undefined>): MountSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
