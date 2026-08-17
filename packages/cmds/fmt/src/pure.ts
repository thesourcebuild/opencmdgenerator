import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { FmtSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "fmt" as const;

export function flagBool(spec: FmtSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: FmtSpec, id: string, value: FlagValue | undefined): FmtSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
