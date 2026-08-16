import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { HtopSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "htop" as const;

export function flagBool(spec: HtopSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: HtopSpec, id: string, value: FlagValue | undefined): HtopSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
