import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { DisownSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "disown" as const;

export function flagBool(spec: DisownSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: DisownSpec,
  id: string,
  value: FlagValue | undefined,
): DisownSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
