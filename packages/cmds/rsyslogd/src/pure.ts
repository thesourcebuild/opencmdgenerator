/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/man/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { RsyslogdSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "rsyslogd" as const;

export function flagBool(spec: RsyslogdSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: RsyslogdSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function flagNumber(spec: RsyslogdSpec, id: string): number | undefined {
  return generic.flagNumber(spec.flags, id);
}

export function setFlag(spec: RsyslogdSpec, id: string, value: FlagValue | undefined): RsyslogdSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: RsyslogdSpec, patch: Record<string, FlagValue | undefined>): RsyslogdSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
