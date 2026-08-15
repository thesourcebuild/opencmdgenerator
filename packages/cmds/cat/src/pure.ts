/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mv/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { CatSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "cat" as const;

export function flagBool(spec: CatSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: CatSpec, id: string, value: FlagValue | undefined): CatSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
