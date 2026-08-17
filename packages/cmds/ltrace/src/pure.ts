import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { LtraceSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "ltrace" as const;

export function flagBool(spec: LtraceSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: LtraceSpec,
  id: string,
  value: FlagValue | undefined,
): LtraceSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
