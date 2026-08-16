import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { EgrepSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "egrep" as const;

export function flagBool(spec: EgrepSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: EgrepSpec, id: string, value: FlagValue | undefined): EgrepSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
