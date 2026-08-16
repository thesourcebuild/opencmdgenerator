import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { FtpSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "ftp" as const;

export function flagBool(spec: FtpSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: FtpSpec, id: string, value: FlagValue | undefined): FtpSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
