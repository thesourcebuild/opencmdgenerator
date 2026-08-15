/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/chmod/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { UnameSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "uname" as const;

export function flagBool(spec: UnameSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: UnameSpec, id: string, value: FlagValue | undefined): UnameSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
