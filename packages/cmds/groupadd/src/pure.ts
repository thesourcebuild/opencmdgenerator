/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/useradd/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { GroupaddSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "groupadd" as const;

export function flagBool(spec: GroupaddSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: GroupaddSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: GroupaddSpec, id: string, value: FlagValue | undefined): GroupaddSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: GroupaddSpec, patch: Record<string, FlagValue | undefined>): GroupaddSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
