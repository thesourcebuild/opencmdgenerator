import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { GroupdelSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "groupdel" as const;

export function flagBool(spec: GroupdelSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: GroupdelSpec,
  id: string,
  value: FlagValue | undefined,
): GroupdelSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
