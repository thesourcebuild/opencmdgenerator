import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { FgSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "fg" as const;

export function flagBool(spec: FgSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: FgSpec, id: string, value: FlagValue | undefined): FgSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
