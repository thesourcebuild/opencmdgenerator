import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { Bzip2Spec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "bzip2" as const;

export function flagBool(spec: Bzip2Spec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: Bzip2Spec, id: string, value: FlagValue | undefined): Bzip2Spec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
