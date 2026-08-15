import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, WhereisSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): WhereisSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    command: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<WhereisSpec>[] = [
  {
    id: "locate-everything",
    label: "Locate binary, manual, and source",
    summary: "A bare whereis — locates the binary, manual page, and source for this command.",
    commandExample: "whereis ls",
    apply: (spec) => ({ ...spec, command: "ls", flags: {} }),
  },
  {
    id: "binary-only",
    label: "Binary path only",
    summary: "-b — searches for the binary only.",
    commandExample: "whereis -b ls",
    apply: (spec) => ({ ...spec, command: "ls", flags: { binaryOnly: true } }),
  },
  {
    id: "find-gaps",
    label: "Find commands with unusual results",
    summary: "-u — reports commands missing one of binary/manual/source, or having more than one of a category.",
    commandExample: "whereis -u ls",
    apply: (spec) => ({ ...spec, command: "ls", flags: { unusual: true } }),
  },
];

export function getPreset(id: string): Preset<WhereisSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
