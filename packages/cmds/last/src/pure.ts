import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { LastSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "last" as const;

export function flagBool(spec: LastSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: LastSpec, id: string, value: FlagValue | undefined): LastSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
