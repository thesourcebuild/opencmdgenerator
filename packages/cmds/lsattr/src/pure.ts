import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { LsattrSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "lsattr" as const;

export function flagBool(spec: LsattrSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: LsattrSpec,
  id: string,
  value: FlagValue | undefined,
): LsattrSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
