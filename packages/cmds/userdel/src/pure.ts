import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { UserdelSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "userdel" as const;

export function flagBool(spec: UserdelSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: UserdelSpec,
  id: string,
  value: FlagValue | undefined,
): UserdelSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
