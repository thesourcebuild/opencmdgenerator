import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { NcSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "nc" as const;

export function flagBool(spec: NcSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: NcSpec, id: string, value: FlagValue | undefined): NcSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
