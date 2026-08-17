import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { BasenameSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "basename" as const;

export function flagBool(spec: BasenameSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: BasenameSpec,
  id: string,
  value: FlagValue | undefined,
): BasenameSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
