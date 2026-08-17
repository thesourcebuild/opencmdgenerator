import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { Tune2fsSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "tune2fs" as const;

export function flagBool(spec: Tune2fsSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: Tune2fsSpec,
  id: string,
  value: FlagValue | undefined,
): Tune2fsSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
