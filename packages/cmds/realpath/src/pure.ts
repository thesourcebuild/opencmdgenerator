import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { RealpathSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "realpath" as const;

export function flagBool(spec: RealpathSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: RealpathSpec,
  id: string,
  value: FlagValue | undefined,
): RealpathSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
