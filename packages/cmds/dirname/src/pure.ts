import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { DirnameSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "dirname" as const;

export function flagBool(spec: DirnameSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: DirnameSpec,
  id: string,
  value: FlagValue | undefined,
): DirnameSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
