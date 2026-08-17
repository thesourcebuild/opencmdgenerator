import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, BasenameSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): BasenameSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<BasenameSpec>[] = [
  {
    id: "path",
    label: "Path basename",
    summary: "Print a path basename",
    commandExample: "basename /usr/bin/node",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["/usr/bin/node"],
    }),
  },
  {
    id: "suffix",
    label: "Strip suffix",
    summary: "Remove a file suffix",
    commandExample: "basename -s .txt notes.txt",
    apply: (spec) => ({
      ...spec,
      flags: {
        suffix: ".txt",
      },
      args: ["notes.txt"],
    }),
  },
];

export function getPreset(id: string): Preset<BasenameSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
