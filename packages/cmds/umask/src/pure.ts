import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { UmaskSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "umask" as const;

export function flagBool(spec: UmaskSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: UmaskSpec, id: string, value: FlagValue | undefined): UmaskSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
