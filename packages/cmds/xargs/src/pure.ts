import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { XargsSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "xargs" as const;

export function flagBool(spec: XargsSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: XargsSpec, id: string, value: FlagValue | undefined): XargsSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
