import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, ViSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): ViSpec {
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
export const PRESETS: readonly Preset<ViSpec>[] = [
  {
    id: "edit-a-file",
    label: "Edit a file",
    summary: "A plain vi — the everyday case.",
    commandExample: "vi notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], startLine: undefined, flags: {} }),
  },
  {
    id: "view-read-only",
    label: "View read-only",
    summary: "-R — the safe-viewing mode: look at (or copy from) a file without risking an accidental edit.",
    commandExample: "vi -R notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], startLine: undefined, flags: { readonly: true } }),
  },
  {
    id: "open-at-line",
    label: "Open at a specific line",
    summary: "+<n> — jumps straight to a line, e.g. when following up on a compiler error or a log reference.",
    commandExample: "vi +42 notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], startLine: 42, flags: {} }),
  },
];

export function getPreset(id: string): Preset<ViSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
