import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { FingerSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "finger" as const;

export function flagBool(spec: FingerSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: FingerSpec,
  id: string,
  value: FlagValue | undefined,
): FingerSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
