import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ChattrSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "chattr" as const;

export function flagBool(spec: ChattrSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: ChattrSpec,
  id: string,
  value: FlagValue | undefined,
): ChattrSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
