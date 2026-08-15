import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { RpmOperation, RpmSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** The bare single-letter operation flag pushed as the leading token — mirrors `@cmdgen/clear`'s `BINARY` record shape. */
const OPERATION_FLAG: Record<RpmOperation, string> = {
  install: "-i",
  erase: "-e",
  query: "-q",
  queryAll: "-qa",
};

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: RpmSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the rpm invocation: operation flag, then catalogue flags, then the target (unused for queryAll). */
export function buildArgv(spec: RpmSpec): Argv {
  const args: Arg[] = [{ text: OPERATION_FLAG[spec.operation], role: "value" }];

  args.push(...buildFlagArgs(spec.flags, CATALOGUE));

  if (spec.operation !== "queryAll") {
    const target = spec.target.trim();
    if (target !== "") {
      args.push({ text: target, role: spec.operation === "install" ? "path" : "value" });
    }
  }

  return { binary: "rpm", args };
}
