import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { IwconfigSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "iwconfig" as const;

export function flagBool(spec: IwconfigSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: IwconfigSpec,
  id: string,
  value: FlagValue | undefined,
): IwconfigSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
