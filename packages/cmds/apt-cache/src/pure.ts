import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { AptCacheSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "apt-cache" as const;

export function flagBool(spec: AptCacheSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: AptCacheSpec,
  id: string,
  value: FlagValue | undefined,
): AptCacheSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
