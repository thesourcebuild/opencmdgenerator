/**
 * Runtime helpers and constants with NO zod import — same reasoning as
 * `@cmdgen/contracts/pure`: the UI needs `setFlag` and the empty-endpoint
 * factories, but never validates anything at runtime.
 *
 * The flag accessors re-derive rsync's old spec-shaped convenience API
 * (`flagBool(spec, id)`) on top of `@cmdgen/contracts/pure`'s generic,
 * flags-record-shaped primitives (`flagBool(flags, id)`), so the rest of
 * this package can keep calling them exactly as before.
 */
import type { DaemonEndpoint, Endpoint, LocalEndpoint, SshEndpoint } from "./endpoint";
import type { FlagValue, FlagValues } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { RsyncSpec } from "./spec";

/**
 * Bumped when the spec shape changes, so share links and profiles can be
 * migrated. Defined here (not in `./spec`) so anything that only needs the
 * version number — like `createSpec` — never triggers `./spec`'s zod schema
 * construction. See the package-level note in `index.ts` about why this
 * package deliberately does not ship zod to the browser.
 */
export const SPEC_VERSION = 1 as const;

/** This command's id in `Profile.commandId` / the command registry. */
export const COMMAND_ID = "rsync" as const;

// ── endpoint factories ──────────────────────────────────────────────────────

export const emptyLocalEndpoint = (): LocalEndpoint => ({ kind: "local", path: "" });

export const emptySshEndpoint = (): SshEndpoint => ({
  kind: "ssh",
  host: "",
  path: "",
  batchMode: false,
  sshOptions: [],
});

export const emptyDaemonEndpoint = (): DaemonEndpoint => ({
  kind: "daemon",
  host: "",
  module: "",
  path: "",
});

export const isRemote = (e: Endpoint): boolean => e.kind !== "local";

// ── flag accessors ──────────────────────────────────────────────────────────

export function flagBool(spec: RsyncSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: RsyncSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function flagNumber(spec: RsyncSpec, id: string): number | undefined {
  return generic.flagNumber(spec.flags, id);
}

export function flagList(spec: RsyncSpec, id: string): string[] {
  return generic.flagList(spec.flags, id);
}

export function flagEnum<T extends string>(
  spec: RsyncSpec,
  id: string,
  allowed: readonly T[],
): T | undefined {
  return generic.flagEnum(spec.flags, id, allowed);
}

export function setFlag(spec: RsyncSpec, id: string, value: FlagValue | undefined): RsyncSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(
  spec: RsyncSpec,
  patch: Record<string, FlagValue | undefined>,
): RsyncSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}

// re-exported so callers that only need the flags-record shape don't have to
// reach into @cmdgen/contracts/pure directly.
export type { FlagValues };
