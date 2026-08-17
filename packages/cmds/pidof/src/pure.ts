import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { PidofSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "pidof" as const;

export function flagBool(spec: PidofSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: PidofSpec, id: string, value: FlagValue | undefined): PidofSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
