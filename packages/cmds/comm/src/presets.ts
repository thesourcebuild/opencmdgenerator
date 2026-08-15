import type { Preset } from "@cmdgen/engine";
import type { CommSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): CommSpec {
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
export const PRESETS: readonly Preset<CommSpec>[] = [
  {
    id: "all-three-columns",
    label: "Show all three columns",
    summary: "The default, made explicit — lines only in file1, lines only in file2, and lines common to both, in that column order.",
    commandExample: "comm sorted-a.txt sorted-b.txt",
    apply: (spec) => ({ ...spec, file1: "sorted-a.txt", file2: "sorted-b.txt", flags: {} }),
  },
  {
    id: "only-in-file1",
    label: "Lines only in file1",
    summary: "-23 — suppresses the file2-only and common columns, leaving just what's unique to file1.",
    commandExample: "comm -23 sorted-a.txt sorted-b.txt",
    apply: (spec) => ({
      ...spec,
      file1: "sorted-a.txt",
      file2: "sorted-b.txt",
      flags: { suppressCol2: true, suppressCol3: true },
    }),
  },
  {
    id: "only-in-file2",
    label: "Lines only in file2",
    summary: "-13 — the mirror image of \"Lines only in file1\".",
    commandExample: "comm -13 sorted-a.txt sorted-b.txt",
    apply: (spec) => ({
      ...spec,
      file1: "sorted-a.txt",
      file2: "sorted-b.txt",
      flags: { suppressCol1: true, suppressCol3: true },
    }),
  },
  {
    id: "common-lines",
    label: "Lines common to both",
    summary: "-12 — suppresses both unique-to-one-file columns, leaving only what both files share.",
    commandExample: "comm -12 sorted-a.txt sorted-b.txt",
    apply: (spec) => ({
      ...spec,
      file1: "sorted-a.txt",
      file2: "sorted-b.txt",
      flags: { suppressCol1: true, suppressCol2: true },
    }),
  },
];

export function getPreset(id: string): Preset<CommSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
