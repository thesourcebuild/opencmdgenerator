import type { Preset } from "@cmdgen/engine";
import type { LocateSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): LocateSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    pattern: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<LocateSpec>[] = [
  {
    id: "basic-search",
    label: "Find files by name",
    summary: "The plain, every-day case — a glob pattern against the whole database.",
    commandExample: "locate '*.conf'",
    apply: (spec) => ({ ...spec, pattern: "*.conf", flags: {} }),
  },
  {
    id: "case-insensitive",
    label: "Case-insensitive search",
    summary: "-i — matches regardless of capitalization.",
    commandExample: "locate -i readme",
    apply: (spec) => ({ ...spec, pattern: "readme", flags: { ignoreCase: true } }),
  },
  {
    id: "count-matches",
    label: "Count matches only",
    summary: "-c — prints a single number instead of every matching path.",
    commandExample: "locate -c '*.log'",
    apply: (spec) => ({ ...spec, pattern: "*.log", flags: { count: true } }),
  },
  {
    id: "regex-search",
    label: "Regular-expression search",
    summary: "-r — reads the pattern as a full regular expression instead of a glob.",
    commandExample: "locate -r '^/etc/.*\\.conf$'",
    apply: (spec) => ({ ...spec, pattern: "^/etc/.*\\.conf$", flags: { regexp: true } }),
  },
];

export function getPreset(id: string): Preset<LocateSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
