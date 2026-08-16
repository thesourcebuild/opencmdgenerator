import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { SsSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "ss" as const;

export function flagBool(spec: SsSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: SsSpec, id: string, value: FlagValue | undefined): SsSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
