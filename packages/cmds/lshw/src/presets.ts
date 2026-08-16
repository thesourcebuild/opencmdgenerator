import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, LshwSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): LshwSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<LshwSpec>[] = [
  {
    id: "short",
    label: "Short summary",
    summary: "Show a compact hardware summary",
    commandExample: "lshw -short",
    apply: (spec) => ({
      ...spec,
      flags: {
        short: true,
      },
      args: [],
    }),
  },
  {
    id: "memory",
    label: "Memory class",
    summary: "Show memory hardware",
    commandExample: "lshw -class memory",
    apply: (spec) => ({
      ...spec,
      flags: {
        class: "memory",
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<LshwSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
