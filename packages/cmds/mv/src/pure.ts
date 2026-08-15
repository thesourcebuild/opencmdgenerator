/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mkdir/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { MvSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "mv" as const;

export function flagBool(spec: MvSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: MvSpec, id: string, value: FlagValue | undefined): MvSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
