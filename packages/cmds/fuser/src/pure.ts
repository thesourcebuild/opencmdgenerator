import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { FuserSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "fuser" as const;

export function flagBool(spec: FuserSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: FuserSpec, id: string, value: FlagValue | undefined): FuserSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
