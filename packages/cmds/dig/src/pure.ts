/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/traceroute/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { DigSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "dig" as const;

export function flagBool(spec: DigSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: DigSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: DigSpec, id: string, value: FlagValue | undefined): DigSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
