import type { Arg, Argv } from "@cmdgen/engine";
import type { GetenforceSpec } from "../spec";

export type { Arg, Argv };

/** Build the getenforce invocation — a bare binary name, nothing else. */
export function buildArgv(spec: GetenforceSpec): Argv {
  void spec;
  return { binary: "getenforce", args: [] };
}
