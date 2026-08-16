import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { TreeSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "tree" as const;

export function flagBool(spec: TreeSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: TreeSpec, id: string, value: FlagValue | undefined): TreeSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
