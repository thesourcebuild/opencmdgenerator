import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, LsattrSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): LsattrSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<LsattrSpec>[] = [
  {
    id: "file",
    label: "List attrs",
    summary: "List attributes for a file",
    commandExample: "lsattr file.txt",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["file.txt"],
    }),
  },
  {
    id: "recursive",
    label: "Recursive attrs",
    summary: "List attributes recursively",
    commandExample: "lsattr -R /etc",
    apply: (spec) => ({
      ...spec,
      flags: {
        recursive: true,
      },
      args: ["/etc"],
    }),
  },
];

export function getPreset(id: string): Preset<LsattrSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
