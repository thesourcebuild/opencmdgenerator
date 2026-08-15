/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/traceroute/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { WhoisSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "whois" as const;

export function flagBool(spec: WhoisSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: WhoisSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: WhoisSpec, id: string, value: FlagValue | undefined): WhoisSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
