import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { EnvSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "env" as const;

export function flagBool(spec: EnvSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: EnvSpec, id: string, value: FlagValue | undefined): EnvSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
