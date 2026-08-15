/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/systemctl/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { JournalctlSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "journalctl" as const;

export function flagBool(spec: JournalctlSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: JournalctlSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function flagNumber(spec: JournalctlSpec, id: string): number | undefined {
  return generic.flagNumber(spec.flags, id);
}

export function setFlag(spec: JournalctlSpec, id: string, value: FlagValue | undefined): JournalctlSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: JournalctlSpec, patch: Record<string, FlagValue | undefined>): JournalctlSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
