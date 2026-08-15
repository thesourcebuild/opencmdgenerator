/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/chmod/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { CmpSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "cmp" as const;

export function flagBool(spec: CmpSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagNumber(spec: CmpSpec, id: string): number | undefined {
  const v = spec.flags[id];
  return typeof v === "number" ? v : undefined;
}

export function setFlag(spec: CmpSpec, id: string, value: FlagValue | undefined): CmpSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
