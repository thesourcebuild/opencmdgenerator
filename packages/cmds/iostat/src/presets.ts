import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, IostatSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): IostatSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<IostatSpec>[] = [
  {
    id: "extended",
    label: "Extended stats",
    summary: "Show extended I/O statistics",
    commandExample: "iostat -x",
    apply: (spec) => ({
      ...spec,
      flags: {
        extended: true,
      },
      args: [],
    }),
  },
  {
    id: "interval",
    label: "Sample interval",
    summary: "Sample every second five times",
    commandExample: "iostat -x 1 5",
    apply: (spec) => ({
      ...spec,
      flags: {
        extended: true,
      },
      args: ["1", "5"],
    }),
  },
];

export function getPreset(id: string): Preset<IostatSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
