import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { IpSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "ip" as const;

export function flagBool(spec: IpSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: IpSpec, id: string, value: FlagValue | undefined): IpSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
