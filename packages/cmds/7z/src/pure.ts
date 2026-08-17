import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { SevenzSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "7z" as const;

export function flagBool(spec: SevenzSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: SevenzSpec,
  id: string,
  value: FlagValue | undefined,
): SevenzSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
