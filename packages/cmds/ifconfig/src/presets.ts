import type { Preset } from "@cmdgen/engine";
import type { IfconfigPlatform, IfconfigSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

// Cygwin/MSYS2/WSL invoke the real `ifconfig` with real POSIX flags/keywords
// — same "posix" side of the axis as linux/mac, matching `platformFlagTag`
// in pure.ts. Only windows-cmd/windows-powershell (real ipconfig) are "windows".
const isPosix = (spec: IfconfigSpec) =>
  spec.platform === "linux" ||
  spec.platform === "mac" ||
  spec.platform === "windows-cygwin" ||
  spec.platform === "windows-msys" ||
  spec.platform === "windows-wsl";
const isWindows = (spec: IfconfigSpec) => !isPosix(spec);

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  platform?: IfconfigPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): IfconfigSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    interfaceName: "",
    state: "",
    netmask: "",
    mtu: "",
    platform: options.platform ?? "linux",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` (and the interfaceName/operand
// fields) wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<IfconfigSpec>[] = [
  {
    id: "list-all-interfaces",
    label: "List all interfaces",
    summary: "The bare, everyday case — ifconfig on POSIX, ipconfig on Windows.",
    commandExample: "ifconfig",
    apply: (spec) => ({ ...spec, interfaceName: "", state: "", netmask: "", mtu: "", flags: {} }),
  },
  {
    id: "bring-interface-up",
    label: "Bring an interface up",
    summary: "A bare interface name followed by the up keyword — POSIX only, ipconfig has no equivalent.",
    commandExample: "ifconfig eth0 up",
    isApplicable: isPosix,
    apply: (spec) =>
      isPosix(spec) ? { ...spec, interfaceName: "eth0", state: "up", netmask: "", mtu: "", flags: {} } : spec,
  },
  {
    id: "release-dhcp-lease",
    label: "Release the DHCP lease",
    summary: "/release — Windows only, POSIX ifconfig has no equivalent.",
    commandExample: "ipconfig /release",
    isApplicable: isWindows,
    apply: (spec) =>
      isWindows(spec) ? { ...spec, interfaceName: "", state: "", netmask: "", mtu: "", flags: { release: true } } : spec,
  },
];

export function getPreset(id: string): Preset<IfconfigSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
