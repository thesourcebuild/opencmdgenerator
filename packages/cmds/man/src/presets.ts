import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, ManSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): ManSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    page: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<ManSpec>[] = [
  {
    id: "read-a-page",
    label: "Read a manual page",
    summary: "A bare man — displays the manual page for this command.",
    commandExample: "man ls",
    apply: (spec) => ({ ...spec, page: "ls", flags: {} }),
  },
  {
    id: "find-the-file",
    label: "Find where a page lives",
    summary: "-w — prints the location of the manual page file instead of displaying it.",
    commandExample: "man -w ls",
    apply: (spec) => ({ ...spec, page: "ls", flags: { whereis: true } }),
  },
  {
    id: "search-by-keyword",
    label: "Search by keyword",
    summary: "-k — searches page names and descriptions for a keyword.",
    commandExample: "man -k copy",
    apply: (spec) => ({ ...spec, page: "copy", flags: { keyword: true } }),
  },
];

export function getPreset(id: string): Preset<ManSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
