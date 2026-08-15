import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, TopSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): TopSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<TopSpec>[] = [
  {
    id: "batch-snapshot",
    label: "Take one batch snapshot",
    summary: "-b -n 1 — runs non-interactively and exits after a single update, useful for scripts and logs.",
    commandExample: "top -b -n 1",
    apply: (spec) => ({ ...spec, flags: { batchMode: true, iterations: "1" } }),
  },
  {
    id: "watch-a-process",
    label: "Watch a single process",
    summary: "-p 1234 — monitors only the given process ID.",
    commandExample: "top -p 1234",
    apply: (spec) => ({ ...spec, flags: { pid: "1234" } }),
  },
  {
    id: "fast-refresh",
    label: "Refresh twice a second",
    summary: "-d 0.5 — updates the display every half second instead of the default delay.",
    commandExample: "top -d 0.5",
    apply: (spec) => ({ ...spec, flags: { delay: "0.5" } }),
  },
];

export function getPreset(id: string): Preset<TopSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
