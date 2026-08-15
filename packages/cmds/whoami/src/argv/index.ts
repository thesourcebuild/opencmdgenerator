import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { WhoamiSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { windowsFlagTag } from "../pure";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: WhoamiSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the whoami invocation. The binary is always literally "whoami" — the one real difference across platforms is which flags exist. */
export function buildArgv(spec: WhoamiSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: windowsFlagTag(spec.platform) });
  return { binary: "whoami", args };
}
