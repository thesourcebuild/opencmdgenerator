/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/man/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { HistorySpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "history" as const;

export function flagBool(spec: HistorySpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagNumber(spec: HistorySpec, id: string): number | undefined {
  return generic.flagNumber(spec.flags, id);
}

export function setFlag(spec: HistorySpec, id: string, value: FlagValue | undefined): HistorySpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: HistorySpec, patch: Record<string, FlagValue | undefined>): HistorySpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
