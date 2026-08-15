import type { Arg, Argv } from "@cmdgen/engine";
import type { SetenforceSpec } from "../spec";

export type { Arg, Argv };

/** Build the setenforce invocation: a single positional word, "Enforcing" or "Permissive". */
export function buildArgv(spec: SetenforceSpec): Argv {
  return { binary: "setenforce", args: [{ text: spec.mode, role: "value" }] };
}
