/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/top/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { VmstatSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "vmstat" as const;

export function flagBool(spec: VmstatSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: VmstatSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: VmstatSpec, id: string, value: FlagValue | undefined): VmstatSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: VmstatSpec, patch: Record<string, FlagValue | undefined>): VmstatSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
