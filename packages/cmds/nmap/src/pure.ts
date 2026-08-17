import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { NmapSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "nmap" as const;

export function flagBool(spec: NmapSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: NmapSpec, id: string, value: FlagValue | undefined): NmapSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
