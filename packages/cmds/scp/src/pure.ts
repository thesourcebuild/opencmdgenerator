/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/ssh/pure` and `@cmdgen/rsync/pure`, and for the same reason.
 */
import type { FlagValue, FlagValues } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { Endpoint, LocalEndpoint, RemoteEndpoint, ScpSpec } from "./spec";

/** Bumped when the spec shape changes, so profiles can be migrated. */
export const SPEC_VERSION = 1 as const;

/** This command's id in `Profile.commandId` / the command registry. */
export const COMMAND_ID = "scp" as const;

// ── endpoint factories ──────────────────────────────────────────────────────

export const emptyLocalEndpoint = (): LocalEndpoint => ({ kind: "local", path: "" });

export const emptyRemoteEndpoint = (): RemoteEndpoint => ({ kind: "remote", host: "", user: "", path: "" });

export const isRemote = (e: Endpoint): boolean => e.kind === "remote";

// ── flag accessors ──────────────────────────────────────────────────────────

export function flagBool(spec: ScpSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: ScpSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function flagNumber(spec: ScpSpec, id: string): number | undefined {
  return generic.flagNumber(spec.flags, id);
}

export function flagEnum<T extends string>(spec: ScpSpec, id: string, allowed: readonly T[]): T | undefined {
  return generic.flagEnum(spec.flags, id, allowed);
}

export function setFlag(spec: ScpSpec, id: string, value: FlagValue | undefined): ScpSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: ScpSpec, patch: Record<string, FlagValue | undefined>): ScpSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}

export type { FlagValues };
