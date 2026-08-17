import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ChshSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "chsh" as const;

export function flagBool(spec: ChshSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: ChshSpec, id: string, value: FlagValue | undefined): ChshSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
