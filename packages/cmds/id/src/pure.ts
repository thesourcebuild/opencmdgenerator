import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { IdSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "id" as const;

export function flagBool(spec: IdSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: IdSpec, id: string, value: FlagValue | undefined): IdSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
