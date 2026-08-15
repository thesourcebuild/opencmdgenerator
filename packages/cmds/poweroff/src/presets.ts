import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, PoweroffSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): PoweroffSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<PoweroffSpec>[] = [
  {
    id: "poweroff-normally",
    label: "Power off normally",
    summary: "A bare poweroff — syncs filesystem buffers first, then powers off.",
    commandExample: "poweroff",
    apply: (spec) => ({ ...spec, flags: {} }),
  },
  {
    id: "force-poweroff",
    label: "Force an immediate power-off",
    summary: "-f — powers off immediately without going through systemd/logind.",
    commandExample: "poweroff -f",
    apply: (spec) => ({ ...spec, flags: { force: true } }),
  },
  {
    id: "no-sync-poweroff",
    label: "Power off without syncing disks",
    summary: "-n — skips flushing filesystem buffers before powering off.",
    commandExample: "poweroff -n",
    apply: (spec) => ({ ...spec, flags: { noSync: true } }),
  },
  {
    id: "wtmp-only-record",
    label: "Log a power-off without actually powering off",
    summary: "-w — only records a wtmp shutdown entry; the machine keeps running.",
    commandExample: "poweroff -w",
    apply: (spec) => ({ ...spec, flags: { wtmpOnly: true } }),
  },
];

export function getPreset(id: string): Preset<PoweroffSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
