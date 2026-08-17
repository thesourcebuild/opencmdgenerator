import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { JoinSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "join" as const;

export function flagBool(spec: JoinSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: JoinSpec, id: string, value: FlagValue | undefined): JoinSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
