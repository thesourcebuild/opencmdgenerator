import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { MountSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: MountSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the mount invocation: catalogue flags, then device and mount point, in order. */
export function buildArgv(spec: MountSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const device = spec.device.trim();
  const mountPoint = spec.mountPoint.trim();
  if (device !== "") args.push({ text: device, role: "path" });
  if (mountPoint !== "") args.push({ text: mountPoint, role: "path" });

  return { binary: "mount", args };
}
