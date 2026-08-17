import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { WSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "w" as const;

export function flagBool(spec: WSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: WSpec, id: string, value: FlagValue | undefined): WSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
