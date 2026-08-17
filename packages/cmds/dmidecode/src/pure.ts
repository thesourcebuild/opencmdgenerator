import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { DmidecodeSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "dmidecode" as const;

export function flagBool(spec: DmidecodeSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: DmidecodeSpec,
  id: string,
  value: FlagValue | undefined,
): DmidecodeSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
