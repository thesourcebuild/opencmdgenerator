import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { TacSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "tac" as const;

export function flagBool(spec: TacSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: TacSpec, id: string, value: FlagValue | undefined): TacSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
