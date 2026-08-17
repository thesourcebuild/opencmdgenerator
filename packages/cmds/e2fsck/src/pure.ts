import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { E2fsckSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "e2fsck" as const;

export function flagBool(spec: E2fsckSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: E2fsckSpec,
  id: string,
  value: FlagValue | undefined,
): E2fsckSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
