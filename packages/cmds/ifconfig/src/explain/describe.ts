import type { IfconfigSpec } from "../spec";
import { flagBool, platformFlagTag } from "../pure";

// Cygwin/MSYS2/WSL invoke the real `ifconfig` and talk about "interfaces",
// not "adapters" — same "posix" side of the axis as linux/mac. Only
// windows-cmd/windows-powershell (real ipconfig) get the Windows wording.
const isWindows = (spec: IfconfigSpec) => platformFlagTag(spec.platform) === "windows";

export function describeSpec(spec: IfconfigSpec): string {
  const interfaceName = spec.interfaceName.trim();

  const parts: string[] = [
    interfaceName !== ""
      ? `Show configuration for ${interfaceName}`
      : isWindows(spec)
        ? "List every network adapter"
        : "List every network interface",
  ];

  if (spec.state === "up") parts.push("bringing it up");
  else if (spec.state === "down") parts.push("bringing it down");

  const netmask = spec.netmask.trim();
  if (netmask !== "") parts.push(`setting its netmask to ${netmask}`);

  const mtu = spec.mtu.trim();
  if (mtu !== "") parts.push(`setting its MTU to ${mtu}`);

  if (flagBool(spec, "all")) parts.push("showing detailed configuration for every adapter");
  if (flagBool(spec, "release")) parts.push("releasing its DHCP lease");
  if (flagBool(spec, "renew")) parts.push("renewing its DHCP lease");
  if (flagBool(spec, "flushDns")) parts.push("flushing the DNS resolver cache");

  return `${parts.join(", ")}.`;
}
