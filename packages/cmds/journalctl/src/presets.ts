import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, JournalctlSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): JournalctlSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    unit: "",
    matches: [],
    extraOptions: [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `unit`/`flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<JournalctlSpec>[] = [
  {
    id: "follow-a-unit",
    label: "Follow a unit's logs live",
    summary: "journalctl -u nginx -f — the journal's equivalent of tail -f.",
    commandExample: "journalctl -u nginx -f",
    apply: (spec) => ({ ...spec, unit: "nginx", matches: [], extraOptions: [], flags: { follow: true } }),
  },
  {
    id: "last-100-lines",
    label: "Last 100 lines of a unit",
    summary: "journalctl -u nginx -n 100 — a quick recent-history check.",
    commandExample: "journalctl -u nginx -n 100",
    apply: (spec) => ({ ...spec, unit: "nginx", matches: [], extraOptions: [], flags: { lines: 100 } }),
  },
  {
    id: "errors-since-boot",
    label: "Errors since this boot",
    summary: "journalctl -b -p err — only error-level-or-worse entries from the current boot.",
    commandExample: "journalctl -b -p err",
    apply: (spec) => ({ ...spec, unit: "", matches: [], extraOptions: [], flags: { boot: true, priority: "err" } }),
  },
  {
    id: "kernel-messages",
    label: "Kernel messages (dmesg)",
    summary: "journalctl -k — the journal's dmesg equivalent.",
    commandExample: "journalctl -k",
    apply: (spec) => ({ ...spec, unit: "", matches: [], extraOptions: [], flags: { dmesg: true } }),
  },
  {
    id: "time-window",
    label: "Entries in a time window",
    summary: "journalctl --since --until — bounds the output to a specific range.",
    commandExample: 'journalctl --since "2024-01-01 00:00:00" --until "2024-01-02 00:00:00"',
    apply: (spec) => ({
      ...spec,
      unit: "",
      matches: [],
      extraOptions: [],
      flags: { since: "2024-01-01 00:00:00", until: "2024-01-02 00:00:00" },
    }),
  },
];

export function getPreset(id: string): Preset<JournalctlSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
