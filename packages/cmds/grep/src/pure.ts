/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mv/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { GrepSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "grep" as const;

export function flagBool(spec: GrepSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagNumber(spec: GrepSpec, id: string): number | undefined {
  const v = spec.flags[id];
  return typeof v === "number" ? v : undefined;
}

export function setFlag(spec: GrepSpec, id: string, value: FlagValue | undefined): GrepSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
