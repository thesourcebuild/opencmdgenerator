import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { LscpuSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "lscpu" as const;

export function flagBool(spec: LscpuSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: LscpuSpec, id: string, value: FlagValue | undefined): LscpuSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
