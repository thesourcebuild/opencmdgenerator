import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, PstreeSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): PstreeSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<PstreeSpec>[] = [
  {
    id: "tree",
    label: "Process tree",
    summary: "Show process tree",
    commandExample: "pstree",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: [],
    }),
  },
  {
    id: "pids",
    label: "Tree with PIDs",
    summary: "Show process tree with PIDs",
    commandExample: "pstree -p",
    apply: (spec) => ({
      ...spec,
      flags: {
        showPids: true,
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<PstreeSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
