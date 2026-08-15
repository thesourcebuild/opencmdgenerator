/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/rsync/pure` and for the same reason: anything that only needs the
 * version number or a flag accessor must not trigger `./spec`'s zod schema
 * construction, or zod ends up in the browser bundle for no benefit.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { CdSpec } from "./spec";

/** Bumped when the spec shape changes, so profiles can be migrated. */
export const SPEC_VERSION = 1 as const;

/** This command's id in `Profile.commandId` / the command registry. */
export const COMMAND_ID = "cd" as const;

// ── flag accessors ──────────────────────────────────────────────────────────
// Re-derive the spec-shaped convenience API on top of @cmdgen/contracts/pure's
// generic, flags-record-shaped primitives — same pattern as @cmdgen/rsync/pure.

export function flagBool(spec: CdSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagEnum<T extends string>(
  spec: CdSpec,
  id: string,
  allowed: readonly T[],
): T | undefined {
  return generic.flagEnum(spec.flags, id, allowed);
}

export function setFlag(spec: CdSpec, id: string, value: FlagValue | undefined): CdSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
