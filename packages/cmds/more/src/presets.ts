import type { Preset } from "@cmdgen/engine";
import type { MoreSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): MoreSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    files: [],
    startLine: undefined,
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<MoreSpec>[] = [
  {
    id: "page-file",
    label: "Page a file",
    summary: "A bare more — the everyday case.",
    commandExample: "more notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], startLine: undefined, flags: {} }),
  },
  {
    id: "with-prompts",
    label: "With helpful prompts",
    summary: "-d — shows a prompt explaining the keys, and what went wrong on an invalid keypress.",
    commandExample: "more -d notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], startLine: undefined, flags: { showPrompts: true } }),
  },
  {
    id: "clear-each-page",
    label: "Clear screen each page",
    summary: "-c — repaints from the top instead of scrolling, which reads better over a slow connection.",
    commandExample: "more -c notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], startLine: undefined, flags: { clearScreen: true } }),
  },
  {
    id: "open-at-line",
    label: "Open at a specific line",
    summary: "+<n> — jumps straight to a line instead of starting at the top.",
    commandExample: "more +42 notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], startLine: 42, flags: {} }),
  },
];

export function getPreset(id: string): Preset<MoreSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
