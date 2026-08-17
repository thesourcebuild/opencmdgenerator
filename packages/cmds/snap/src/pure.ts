import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { SnapSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "snap" as const;

export function flagBool(spec: SnapSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: SnapSpec, id: string, value: FlagValue | undefined): SnapSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
