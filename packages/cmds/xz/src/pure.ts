import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { XzSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "xz" as const;

export function flagBool(spec: XzSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: XzSpec, id: string, value: FlagValue | undefined): XzSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
