import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ChkconfigSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "chkconfig" as const;

export function flagBool(spec: ChkconfigSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: ChkconfigSpec,
  id: string,
  value: FlagValue | undefined,
): ChkconfigSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
