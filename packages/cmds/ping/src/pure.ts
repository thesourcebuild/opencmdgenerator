/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/traceroute/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { PingSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "ping" as const;

export function flagBool(spec: PingSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: PingSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: PingSpec, id: string, value: FlagValue | undefined): PingSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
