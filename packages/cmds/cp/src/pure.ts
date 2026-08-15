/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mv/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { CpSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "cp" as const;

export function flagBool(spec: CpSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: CpSpec, id: string, value: FlagValue | undefined): CpSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
