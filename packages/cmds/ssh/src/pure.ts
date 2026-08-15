/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/rsync/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { SshSpec } from "./spec";

/** Bumped when the spec shape changes, so profiles can be migrated. */
export const SPEC_VERSION = 1 as const;

/** This command's id in `Profile.commandId` / the command registry. */
export const COMMAND_ID = "ssh" as const;

// ── flag accessors ──────────────────────────────────────────────────────────

export function flagBool(spec: SshSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: SshSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function flagNumber(spec: SshSpec, id: string): number | undefined {
  return generic.flagNumber(spec.flags, id);
}

export function flagEnum<T extends string>(
  spec: SshSpec,
  id: string,
  allowed: readonly T[],
): T | undefined {
  return generic.flagEnum(spec.flags, id, allowed);
}

export function setFlag(spec: SshSpec, id: string, value: FlagValue | undefined): SshSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: SshSpec, patch: Record<string, FlagValue | undefined>): SshSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
