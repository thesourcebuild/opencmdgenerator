import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { BgSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "bg" as const;

export function flagBool(spec: BgSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: BgSpec, id: string, value: FlagValue | undefined): BgSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
