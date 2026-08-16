import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { TelnetSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "telnet" as const;

export function flagBool(spec: TelnetSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: TelnetSpec,
  id: string,
  value: FlagValue | undefined,
): TelnetSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
