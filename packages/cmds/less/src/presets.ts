import type { Preset } from "@cmdgen/engine";
import type { LessSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): LessSpec {
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
export const PRESETS: readonly Preset<LessSpec>[] = [
  {
    id: "page-file",
    label: "Page a file",
    summary: "A bare less — the everyday case.",
    commandExample: "less notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], flags: {} }),
  },
  {
    id: "with-line-numbers",
    label: "With line numbers",
    summary: "-N — useful when reading code or logs you'll need to reference by line.",
    commandExample: "less -N notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], flags: { lineNumbers: true } }),
  },
  {
    id: "colorized-output",
    label: "Preserve colorized output",
    summary: "-R — the fix when piping colorized output (grep --color, ls --color) into less.",
    commandExample: "less -R notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], flags: { rawControlChars: true } }),
  },
];

export function getPreset(id: string): Preset<LessSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
