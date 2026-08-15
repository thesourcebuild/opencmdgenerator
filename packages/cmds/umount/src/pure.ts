/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mount/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { UmountSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "umount" as const;

export function flagBool(spec: UmountSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: UmountSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: UmountSpec, id: string, value: FlagValue | undefined): UmountSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
