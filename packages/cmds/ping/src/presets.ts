import type { Preset } from "@cmdgen/engine";
import type { PingSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): PingSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    host: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` (and `host`) wholesale — same rule
// as every other command this session.
export const PRESETS: readonly Preset<PingSpec>[] = [
  {
    id: "ping-continuously",
    label: "Ping a host continuously",
    summary: "The plain, everyday case — no -c, so ping runs until you press Ctrl-C.",
    commandExample: "ping example.com",
    apply: (spec) => ({ ...spec, host: "example.com", flags: {} }),
  },
  {
    id: "ping-a-fixed-count",
    label: "Ping a fixed number of times",
    summary: "-c 4 — sends exactly 4 packets and stops on its own, good for scripts.",
    commandExample: "ping -c 4 example.com",
    apply: (spec) => ({ ...spec, host: "example.com", flags: { count: "4" } }),
  },
  {
    id: "ping-with-timeout",
    label: "Ping with a per-reply timeout",
    summary: "-c 4 -W 5 — stops waiting for any single reply after 5 seconds.",
    commandExample: "ping -c 4 -W 5 example.com",
    apply: (spec) => ({ ...spec, host: "example.com", flags: { count: "4", timeout: "5" } }),
  },
  {
    id: "ping-large-packets",
    label: "Ping with a larger packet size",
    summary: "-s 1000 — useful for spotting MTU/fragmentation problems along the path.",
    commandExample: "ping -c 4 -s 1000 example.com",
    apply: (spec) => ({ ...spec, host: "example.com", flags: { count: "4", size: "1000" } }),
  },
];

export function getPreset(id: string): Preset<PingSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
