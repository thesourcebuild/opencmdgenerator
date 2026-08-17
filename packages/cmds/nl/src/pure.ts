import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { NlSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "nl" as const;

export function flagBool(spec: NlSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: NlSpec, id: string, value: FlagValue | undefined): NlSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
