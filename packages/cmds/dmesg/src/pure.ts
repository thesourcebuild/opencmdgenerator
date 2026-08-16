import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { DmesgSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "dmesg" as const;

export function flagBool(spec: DmesgSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: DmesgSpec, id: string, value: FlagValue | undefined): DmesgSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
