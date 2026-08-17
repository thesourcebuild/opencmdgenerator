import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { PstreeSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "pstree" as const;

export function flagBool(spec: PstreeSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: PstreeSpec,
  id: string,
  value: FlagValue | undefined,
): PstreeSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
