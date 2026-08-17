import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { MkswapSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "mkswap" as const;

export function flagBool(spec: MkswapSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: MkswapSpec,
  id: string,
  value: FlagValue | undefined,
): MkswapSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
