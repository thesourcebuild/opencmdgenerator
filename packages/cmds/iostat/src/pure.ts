import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { IostatSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "iostat" as const;

export function flagBool(spec: IostatSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: IostatSpec,
  id: string,
  value: FlagValue | undefined,
): IostatSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
