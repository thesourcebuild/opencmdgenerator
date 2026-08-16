import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { UnaliasSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "unalias" as const;

export function flagBool(spec: UnaliasSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: UnaliasSpec,
  id: string,
  value: FlagValue | undefined,
): UnaliasSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
