import type { Preset } from "@cmdgen/engine";
import type { DuSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): DuSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    paths: [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `paths` and `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<DuSpec>[] = [
  {
    id: "human-readable-total",
    label: "Human-readable total",
    summary: "-h -s — a single human-readable total for a directory.",
    commandExample: "du -h -s /var/log",
    apply: (spec) => ({ ...spec, paths: ["/var/log"], flags: { humanReadable: true, summarize: true } }),
  },
  {
    id: "one-level-deep",
    label: "One level of subdirectories",
    summary: "-h --max-depth=1 — human-readable totals for each immediate subdirectory.",
    commandExample: "du -h --max-depth=1 /home",
    apply: (spec) => ({ ...spec, paths: ["/home"], flags: { humanReadable: true, maxDepth: 1 } }),
  },
  {
    id: "grand-total",
    label: "Grand total across paths",
    summary: "-h -c — human-readable sizes for each path plus a combined total.",
    commandExample: "du -h -c /var /home",
    apply: (spec) => ({ ...spec, paths: ["/var", "/home"], flags: { humanReadable: true, total: true } }),
  },
  {
    id: "every-file",
    label: "Every file, not just directories",
    summary: "-h -a — lists sizes for individual files as well as directories.",
    commandExample: "du -h -a /var/log",
    apply: (spec) => ({ ...spec, paths: ["/var/log"], flags: { humanReadable: true, all: true } }),
  },
];

export function getPreset(id: string): Preset<DuSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
