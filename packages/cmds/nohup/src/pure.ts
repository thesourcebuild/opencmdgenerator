import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { NohupSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "nohup" as const;

export function flagBool(spec: NohupSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: NohupSpec, id: string, value: FlagValue | undefined): NohupSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
