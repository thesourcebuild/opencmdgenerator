import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { MtrSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "mtr" as const;

export function flagBool(spec: MtrSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: MtrSpec, id: string, value: FlagValue | undefined): MtrSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
