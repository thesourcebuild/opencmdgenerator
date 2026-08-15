import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { TracerouteSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { platformFlagTag } from "../pure";

export type { Arg, Argv };

/**
 * Same shape as `@cmdgen/clear`'s `BINARY` record — a different binary per
 * platform, not just different flags. windows-cygwin/windows-msys/windows-wsl
 * route to the real `traceroute` binary, same as linux/mac — NOT `tracert`.
 */
const BINARY: Record<TracerouteSpec["platform"], string> = {
  linux: "traceroute",
  mac: "traceroute",
  "windows-cmd": "tracert",
  "windows-powershell": "tracert",
  "windows-cygwin": "traceroute",
  "windows-msys": "traceroute",
  "windows-wsl": "traceroute",
};

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: TracerouteSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the traceroute/tracert invocation: catalogue flags gated by the
 * collapsed posix/windows tag, then the mandatory host positional (role
 * "host" — the same role ssh/scp use for their own single mandatory
 * destination) at the end.
 */
export function buildArgv(spec: TracerouteSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: platformFlagTag(spec.platform) });

  const host = spec.host.trim();
  if (host !== "") args.push({ text: host, role: "host" });

  return { binary: BINARY[spec.platform], args };
}
