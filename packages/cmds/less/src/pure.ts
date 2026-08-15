/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/chmod/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { LessSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "less" as const;

export function flagBool(spec: LessSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: LessSpec, id: string, value: FlagValue | undefined): LessSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
