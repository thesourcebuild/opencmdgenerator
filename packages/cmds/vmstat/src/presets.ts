import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, VmstatSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): VmstatSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    interval: undefined,
    count: undefined,
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<VmstatSpec>[] = [
  {
    id: "one-shot",
    label: "One-shot snapshot",
    summary: "vmstat — a single snapshot of the default report, no repeating.",
    commandExample: "vmstat",
    apply: (spec) => ({ ...spec, interval: undefined, count: undefined, flags: {} }),
  },
  {
    id: "repeat-every-2-seconds",
    label: "Repeat every 2 seconds",
    summary: "vmstat 2 — reprints the default report every 2 seconds until interrupted.",
    commandExample: "vmstat 2",
    apply: (spec) => ({ ...spec, interval: 2, count: undefined, flags: {} }),
  },
  {
    id: "repeat-with-count",
    label: "Repeat 5 times, every 2 seconds",
    summary: "vmstat 2 5 — prints 5 samples, 2 seconds apart, then stops.",
    commandExample: "vmstat 2 5",
    apply: (spec) => ({ ...spec, interval: 2, count: 5, flags: {} }),
  },
  {
    id: "disk-statistics",
    label: "Disk statistics",
    summary: "-d — reports per-disk read/write/I/O statistics instead of the default report.",
    commandExample: "vmstat -d",
    apply: (spec) => ({ ...spec, interval: undefined, count: undefined, flags: { disk: true } }),
  },
  {
    id: "event-counter-table",
    label: "Event counter summary",
    summary: "-s — prints a vertical table of event counters and memory statistics.",
    commandExample: "vmstat -s",
    apply: (spec) => ({ ...spec, interval: undefined, count: undefined, flags: { stats: true } }),
  },
];

export function getPreset(id: string): Preset<VmstatSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
