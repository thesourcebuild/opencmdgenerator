import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { StatSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "stat" as const;

export function flagBool(spec: StatSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: StatSpec, id: string, value: FlagValue | undefined): StatSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
