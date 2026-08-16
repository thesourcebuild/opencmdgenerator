import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { Bunzip2Spec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "bunzip2" as const;

export function flagBool(spec: Bunzip2Spec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: Bunzip2Spec,
  id: string,
  value: FlagValue | undefined,
): Bunzip2Spec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
