import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { FlatpakSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "flatpak" as const;

export function flagBool(spec: FlatpakSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: FlatpakSpec,
  id: string,
  value: FlagValue | undefined,
): FlatpakSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
