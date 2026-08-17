import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { UnxzSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "unxz" as const;

export function flagBool(spec: UnxzSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: UnxzSpec, id: string, value: FlagValue | undefined): UnxzSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
