import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { StraceSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "strace" as const;

export function flagBool(spec: StraceSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: StraceSpec,
  id: string,
  value: FlagValue | undefined,
): StraceSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
