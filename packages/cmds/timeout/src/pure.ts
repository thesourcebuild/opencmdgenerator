import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { TimeoutSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "timeout" as const;

export function flagBool(spec: TimeoutSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: TimeoutSpec,
  id: string,
  value: FlagValue | undefined,
): TimeoutSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
