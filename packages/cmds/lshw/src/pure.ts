import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { LshwSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "lshw" as const;

export function flagBool(spec: LshwSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: LshwSpec, id: string, value: FlagValue | undefined): LshwSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
