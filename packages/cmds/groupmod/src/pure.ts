/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/useradd/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { GroupmodSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "groupmod" as const;

export function flagBool(spec: GroupmodSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: GroupmodSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: GroupmodSpec, id: string, value: FlagValue | undefined): GroupmodSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: GroupmodSpec, patch: Record<string, FlagValue | undefined>): GroupmodSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
