import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { TarMode, TarSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "tar" as const;

/**
 * Modes bsdtar simply does not have. Its own usage message lists exactly
 * "-c Create  -r Add/Replace  -t List  -u Update  -x Extract" — so unlike the
 * flag differences these are missing *capabilities*, not different spellings,
 * and no translation produces an equivalent command.
 *
 * Lives here rather than in spec.ts because the package barrel re-exports
 * spec.ts as types only, to keep zod out of the browser bundle.
 */
export const BSD_UNSUPPORTED_MODES: readonly TarMode[] = ["diff", "delete", "concatenate", "testLabel"];

/** Compressor choice, reading whichever per-variant enum applies. */
export function compressionOf(spec: TarSpec): string | undefined {
  const id = spec.variant === "bsd" ? "compressionBsd" : "compressionGnu";
  const value = spec.flags[id];
  return typeof value === "string" && value !== "" && value !== "none" ? value : undefined;
}

export function flagBool(spec: TarSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: TarSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function flagNumber(spec: TarSpec, id: string): number | undefined {
  return generic.flagNumber(spec.flags, id);
}

export function flagEnum<T extends string>(spec: TarSpec, id: string, allowed: readonly T[]): T | undefined {
  return generic.flagEnum(spec.flags, id, allowed);
}

export function setFlag(spec: TarSpec, id: string, value: FlagValue | undefined): TarSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: TarSpec, patch: Record<string, FlagValue | undefined>): TarSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
