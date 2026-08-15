import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, WcSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): WcSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    files: [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<WcSpec>[] = [
  {
    id: "count-everything",
    label: "Count lines, words, and bytes",
    summary: "A bare wc — prints all three, in that order.",
    commandExample: "wc file.txt",
    apply: (spec) => ({ ...spec, files: ["file.txt"], flags: {} }),
  },
  {
    id: "count-lines",
    label: "Count lines only",
    summary: "-l — the most common single-purpose use, e.g. counting rows in a file.",
    commandExample: "wc -l file.txt",
    apply: (spec) => ({ ...spec, files: ["file.txt"], flags: { lines: true } }),
  },
  {
    id: "count-words",
    label: "Count words only",
    summary: "-w",
    commandExample: "wc -w file.txt",
    apply: (spec) => ({ ...spec, files: ["file.txt"], flags: { words: true } }),
  },
  {
    id: "count-characters",
    label: "Count characters only",
    summary: "-m — character count under the current locale, not raw byte count.",
    commandExample: "wc -m file.txt",
    apply: (spec) => ({ ...spec, files: ["file.txt"], flags: { chars: true } }),
  },
];

export function getPreset(id: string): Preset<WcSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
