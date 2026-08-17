import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { InsmodSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "insmod" as const;

export function flagBool(spec: InsmodSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: InsmodSpec,
  id: string,
  value: FlagValue | undefined,
): InsmodSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
