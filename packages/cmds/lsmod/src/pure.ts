import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { LsmodSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "lsmod" as const;

export function flagBool(spec: LsmodSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: LsmodSpec, id: string, value: FlagValue | undefined): LsmodSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
