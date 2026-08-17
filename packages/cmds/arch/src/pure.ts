import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ArchSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "arch" as const;

export function flagBool(spec: ArchSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: ArchSpec, id: string, value: FlagValue | undefined): ArchSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
