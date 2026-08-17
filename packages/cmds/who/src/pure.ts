import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { WhoSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "who" as const;

export function flagBool(spec: WhoSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: WhoSpec, id: string, value: FlagValue | undefined): WhoSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
