import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { JobsSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "jobs" as const;

export function flagBool(spec: JobsSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: JobsSpec, id: string, value: FlagValue | undefined): JobsSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
