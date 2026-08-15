import type { Preset } from "@cmdgen/engine";
import type { NetstatSpec, ShellDialect } from "./spec";
import { SPEC_VERSION } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  shell?: ShellDialect;
}

export function createSpec(options: CreateSpecOptions = {}): NetstatSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every
// other command this session.
export const PRESETS: readonly Preset<NetstatSpec>[] = [
  {
    id: "listening-ports",
    label: "Show listening ports",
    summary: "-tuln — the everyday \"what's listening on this box\" view, numeric and fast.",
    commandExample: "netstat -tuln",
    apply: (spec) => ({ ...spec, flags: { tcp: true, udp: true, listening: true, numeric: true } }),
  },
  {
    id: "listening-with-programs",
    label: "Show listening ports with their owning program",
    summary: "-tulnp — adds the PID/program column; needs root to see other users' processes.",
    commandExample: "netstat -tulnp",
    apply: (spec) => ({ ...spec, flags: { tcp: true, udp: true, listening: true, numeric: true, program: true } }),
  },
  {
    id: "all-connections",
    label: "Show all TCP connections",
    summary: "-ant — every TCP socket, not just listening ones.",
    commandExample: "netstat -ant",
    apply: (spec) => ({ ...spec, flags: { all: true, numeric: true, tcp: true } }),
  },
  {
    id: "routing-table",
    label: "Show the routing table",
    summary: "-r — the traditional way to see the kernel routing table via netstat.",
    commandExample: "netstat -r",
    apply: (spec) => ({ ...spec, flags: { route: true } }),
  },
];

export function getPreset(id: string): Preset<NetstatSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
