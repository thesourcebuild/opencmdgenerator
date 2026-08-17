import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { DpkgSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "dpkg" as const;

export function flagBool(spec: DpkgSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: DpkgSpec, id: string, value: FlagValue | undefined): DpkgSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
