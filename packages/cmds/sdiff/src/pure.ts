import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { SdiffSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "sdiff" as const;

export function flagBool(spec: SdiffSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: SdiffSpec, id: string, value: FlagValue | undefined): SdiffSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
