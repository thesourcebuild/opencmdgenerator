import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { HexdumpSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "hexdump" as const;

export function flagBool(spec: HexdumpSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: HexdumpSpec,
  id: string,
  value: FlagValue | undefined,
): HexdumpSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
