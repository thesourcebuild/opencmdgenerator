import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { OdSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "od" as const;

export function flagBool(spec: OdSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: OdSpec, id: string, value: FlagValue | undefined): OdSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
