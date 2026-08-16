import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, TreeSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): TreeSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<TreeSpec>[] = [
  {
    id: "current",
    label: "Current tree",
    summary: "Current tree",
    commandExample: "tree",
    apply: (spec) => ({ ...spec, flags: {}, args: [] }),
  },
  {
    id: "levels",
    label: "Two levels",
    summary: "Two levels",
    commandExample: "tree -L 2 src",
    apply: (spec) => ({
      ...spec,
      flags: {
        level: 2,
      },
      args: ["src"],
    }),
  },
  {
    id: "dirs",
    label: "Directories only",
    summary: "Directories only",
    commandExample: "tree -d .",
    apply: (spec) => ({
      ...spec,
      flags: {
        directoriesOnly: true,
      },
      args: ["."],
    }),
  },
];

export function getPreset(id: string): Preset<TreeSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
