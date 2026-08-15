import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { MkfsSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: MkfsSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the mkfs invocation: `-t TYPE` (a spec-level field, pushed manually —
 * see `catalogue/flags.ts`), then catalogue flags, then the device.
 */
export function buildArgv(spec: MkfsSpec): Argv {
  const args: Arg[] = [];

  const type = spec.filesystemType.trim();
  if (type !== "") {
    args.push({ text: "-t", role: "flag" });
    args.push({ text: type, role: "value" });
  }

  args.push(...buildFlagArgs(spec.flags, CATALOGUE));

  const device = spec.device.trim();
  if (device !== "") args.push({ text: device, role: "path" });

  return { binary: "mkfs", args };
}
