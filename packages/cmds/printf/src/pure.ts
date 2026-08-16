import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { PrintfSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "printf" as const;

export function flagBool(spec: PrintfSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: PrintfSpec,
  id: string,
  value: FlagValue | undefined,
): PrintfSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
