import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { TrSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "tr" as const;

export function flagBool(spec: TrSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: TrSpec, id: string, value: FlagValue | undefined): TrSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
