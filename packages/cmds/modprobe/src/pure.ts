import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ModprobeSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "modprobe" as const;

export function flagBool(spec: ModprobeSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: ModprobeSpec,
  id: string,
  value: FlagValue | undefined,
): ModprobeSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
