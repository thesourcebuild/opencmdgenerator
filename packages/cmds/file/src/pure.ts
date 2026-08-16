import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { FileSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "file" as const;

export function flagBool(spec: FileSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: FileSpec, id: string, value: FlagValue | undefined): FileSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
