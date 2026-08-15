import type { Preset } from "@cmdgen/engine";
import type { CmpSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): CmpSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    file1: "",
    file2: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<CmpSpec>[] = [
  {
    id: "compare-files",
    label: "Compare two files",
    summary: "The plain, everyday case — stops and reports the first byte where they differ.",
    commandExample: "cmp a.bin b.bin",
    apply: (spec) => ({ ...spec, file1: "a.bin", file2: "b.bin", flags: {} }),
  },
  {
    id: "just-check",
    label: "Just check if they differ",
    summary: "-s — prints nothing, only the exit status matters. The usual choice inside a script.",
    commandExample: "cmp -s a.bin b.bin",
    apply: (spec) => ({ ...spec, file1: "a.bin", file2: "b.bin", flags: { silent: true } }),
  },
  {
    id: "show-every-difference",
    label: "Show every differing byte",
    summary: "-l — lists every byte offset and value that differs, not just the first.",
    commandExample: "cmp -l a.bin b.bin",
    apply: (spec) => ({ ...spec, file1: "a.bin", file2: "b.bin", flags: { verbose: true } }),
  },
];

export function getPreset(id: string): Preset<CmpSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
