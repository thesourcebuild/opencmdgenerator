import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ExitSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "exit" as const;

export function flagBool(spec: ExitSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: ExitSpec, id: string, value: FlagValue | undefined): ExitSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
