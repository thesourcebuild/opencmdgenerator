import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { StringsSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "strings" as const;

export function flagBool(spec: StringsSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: StringsSpec,
  id: string,
  value: FlagValue | undefined,
): StringsSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
