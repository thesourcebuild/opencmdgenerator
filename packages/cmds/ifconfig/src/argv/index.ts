import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { IfconfigSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { platformFlagTag } from "../pure";

export type { Arg, Argv };

const BINARY: Record<IfconfigSpec["platform"], string> = {
  linux: "ifconfig",
  mac: "ifconfig",
  "windows-cmd": "ipconfig",
  "windows-powershell": "ipconfig",
  // Cygwin/MSYS2/WSL are genuine bash environments where net-tools' real
  // `ifconfig` is what a user would expect — same binary and flags as
  // linux/mac, NOT ipconfig. See `platformFlagTag` in pure.ts.
  "windows-cygwin": "ifconfig",
  "windows-msys": "ifconfig",
  "windows-wsl": "ifconfig",
};

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: IfconfigSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the ifconfig/ipconfig invocation. `ipconfig.exe` behaves identically
 * whether invoked from cmd.exe or PowerShell — same reasoning as
 * `@cmdgen/whoami` — so both windows platform values share one branch here.
 *
 * ifconfig's up/down/netmask/mtu are bare keyword (and keyword+value) tokens
 * with no leading dash, so they're spec-level fields (see spec.ts) pushed
 * manually as bare `Arg`s below, rather than going through the catalogue
 * machinery at all. They only apply on POSIX — real ipconfig has no
 * equivalent for any of them, so they're simply skipped on Windows.
 */
export function buildArgv(spec: IfconfigSpec): Argv {
  const interfaceName = spec.interfaceName.trim();
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: platformFlagTag(spec.platform) });

  if (platformFlagTag(spec.platform) === "windows") {
    // Real `ipconfig /release "Ethernet"` takes an optional adapter name
    // after the flag, so the interface name is pushed after the flags here.
    if (interfaceName !== "") args.push({ text: interfaceName, role: "value" });
    return { binary: BINARY[spec.platform], args };
  }

  if (interfaceName !== "") args.push({ text: interfaceName, role: "value" });
  if (spec.state !== "") args.push({ text: spec.state, role: "value" });

  const netmask = spec.netmask.trim();
  if (netmask !== "") args.push({ text: "netmask", role: "value" }, { text: netmask, role: "value" });

  const mtu = spec.mtu.trim();
  if (mtu !== "") args.push({ text: "mtu", role: "value" }, { text: mtu, role: "value" });

  return { binary: BINARY[spec.platform], args };
}
