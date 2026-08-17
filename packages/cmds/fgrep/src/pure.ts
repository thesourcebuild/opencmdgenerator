import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { FgrepSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "fgrep" as const;

export function flagBool(spec: FgrepSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: FgrepSpec, id: string, value: FlagValue | undefined): FgrepSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
