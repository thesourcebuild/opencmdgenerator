import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, FgrepSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function")
    return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  args?: string[];
  shell?: ShellDialect;
}

export function createSpec(options: CreateSpecOptions = {}): FgrepSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<FgrepSpec>[] = [
  {
    id: "file",
    label: "Search file",
    summary: "Search a file for a fixed string",
    commandExample: "fgrep needle file.txt",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["needle", "file.txt"],
    }),
  },
  {
    id: "recursive",
    label: "Recursive search",
    summary: "Search recursively with line numbers",
    commandExample: "fgrep -n -r TODO src",
    apply: (spec) => ({
      ...spec,
      flags: {
        recursive: true,
        lineNumber: true,
      },
      args: ["TODO", "src"],
    }),
  },
];

export function getPreset(id: string): Preset<FgrepSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
