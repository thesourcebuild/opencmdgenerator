import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { RmmodSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "rmmod" as const;

export function flagBool(spec: RmmodSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: RmmodSpec, id: string, value: FlagValue | undefined): RmmodSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
