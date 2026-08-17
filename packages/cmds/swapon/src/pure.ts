import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { SwaponSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "swapon" as const;

export function flagBool(spec: SwaponSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: SwaponSpec,
  id: string,
  value: FlagValue | undefined,
): SwaponSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
