import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { PgrepSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "pgrep" as const;

export function flagBool(spec: PgrepSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: PgrepSpec, id: string, value: FlagValue | undefined): PgrepSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
