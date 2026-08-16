import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { TimedatectlSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "timedatectl" as const;

export function flagBool(spec: TimedatectlSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: TimedatectlSpec,
  id: string,
  value: FlagValue | undefined,
): TimedatectlSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
