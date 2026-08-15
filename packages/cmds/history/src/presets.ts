import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, HistorySpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): HistorySpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    count: undefined,
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` AND `count` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<HistorySpec>[] = [
  {
    id: "show-last-n",
    label: "Show last N commands",
    summary: "A bare count — shows only the most recent entries from the history list.",
    commandExample: "history 20",
    apply: (spec) => ({ ...spec, count: 20, flags: {} }),
  },
  {
    id: "clear-history",
    label: "Clear history",
    summary: "-c — wipes the entire history list for this session. HST001 flags this as irreversible.",
    commandExample: "history -c",
    apply: (spec) => ({ ...spec, count: undefined, flags: { clear: true } }),
  },
  {
    id: "delete-one-entry",
    label: "Delete one entry",
    summary: "-d — removes a single entry from the history list by its offset.",
    commandExample: "history -d 42",
    apply: (spec) => ({ ...spec, count: undefined, flags: { deleteOffset: 42 } }),
  },
];

export function getPreset(id: string): Preset<HistorySpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
