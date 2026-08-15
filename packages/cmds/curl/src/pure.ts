import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { CurlSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "curl" as const;

export function flagBool(spec: CurlSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: CurlSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function flagNumber(spec: CurlSpec, id: string): number | undefined {
  return generic.flagNumber(spec.flags, id);
}

export function flagEnum<T extends string>(spec: CurlSpec, id: string, allowed: readonly T[]): T | undefined {
  return generic.flagEnum(spec.flags, id, allowed);
}

export function setFlag(spec: CurlSpec, id: string, value: FlagValue | undefined): CurlSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: CurlSpec, patch: Record<string, FlagValue | undefined>): CurlSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}

export function validUrls(spec: CurlSpec): string[] {
  return spec.urls.map((u) => u.trim()).filter((u) => u !== "");
}
