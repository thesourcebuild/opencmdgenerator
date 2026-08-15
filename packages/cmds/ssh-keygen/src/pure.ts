/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/ssh/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { SshKeygenSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "ssh-keygen" as const;

export function flagBool(spec: SshKeygenSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: SshKeygenSpec, id: string, value: FlagValue | undefined): SshKeygenSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
