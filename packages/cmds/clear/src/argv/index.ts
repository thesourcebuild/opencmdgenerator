import { buildFlagArgs, type Arg, type Argv } from "@cmdgen/engine";
import type { ClearSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

const BINARY: Record<ClearSpec["platform"], string> = {
  linux: "clear",
  mac: "clear",
  "windows-cmd": "cls",
  "windows-powershell": "Clear-Host",
  "windows-cygwin": "clear",
  "windows-msys": "clear",
  "windows-wsl": "clear",
};

/** Build the clear invocation — a bare binary name, plus the one POSIX-only flag. */
export function buildArgv(spec: ClearSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform });
  return { binary: BINARY[spec.platform], args };
}
