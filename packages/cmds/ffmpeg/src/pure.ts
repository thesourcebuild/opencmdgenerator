import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { FfmpegSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "ffmpeg" as const;

export function flagBool(spec: FfmpegSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: FfmpegSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function flagNumber(spec: FfmpegSpec, id: string): number | undefined {
  return generic.flagNumber(spec.flags, id);
}

export function flagEnum<T extends string>(spec: FfmpegSpec, id: string, allowed: readonly T[]): T | undefined {
  return generic.flagEnum(spec.flags, id, allowed);
}

export function setFlag(spec: FfmpegSpec, id: string, value: FlagValue | undefined): FfmpegSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: FfmpegSpec, patch: Record<string, FlagValue | undefined>): FfmpegSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}

/** Non-blank input paths, in order — what actually renders as repeated `-i`. */
export function validInputFiles(spec: FfmpegSpec): string[] {
  return spec.inputFiles.map((f) => f.trim()).filter((f) => f !== "");
}
