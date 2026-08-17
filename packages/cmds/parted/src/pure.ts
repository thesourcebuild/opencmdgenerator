import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { PartedSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "parted" as const;

export function flagBool(spec: PartedSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: PartedSpec,
  id: string,
  value: FlagValue | undefined,
): PartedSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
