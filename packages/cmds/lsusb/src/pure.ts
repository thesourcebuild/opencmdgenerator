import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { LsusbSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "lsusb" as const;

export function flagBool(spec: LsusbSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: LsusbSpec, id: string, value: FlagValue | undefined): LsusbSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
