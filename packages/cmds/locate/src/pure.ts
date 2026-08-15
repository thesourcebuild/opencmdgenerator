/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mount/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { LocateSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "locate" as const;

export function flagBool(spec: LocateSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: LocateSpec, id: string, value: FlagValue | undefined): LocateSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
