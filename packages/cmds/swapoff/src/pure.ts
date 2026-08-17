import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { SwapoffSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "swapoff" as const;

export function flagBool(spec: SwapoffSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: SwapoffSpec,
  id: string,
  value: FlagValue | undefined,
): SwapoffSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
