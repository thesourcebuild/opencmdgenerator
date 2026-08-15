/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mkdir/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { LnSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "ln" as const;

export function flagBool(spec: LnSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: LnSpec, id: string, value: FlagValue | undefined): LnSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
