import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ReniceSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "renice" as const;

export function flagBool(spec: ReniceSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: ReniceSpec,
  id: string,
  value: FlagValue | undefined,
): ReniceSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
