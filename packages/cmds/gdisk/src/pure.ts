import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { GdiskSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "gdisk" as const;

export function flagBool(spec: GdiskSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: GdiskSpec, id: string, value: FlagValue | undefined): GdiskSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
