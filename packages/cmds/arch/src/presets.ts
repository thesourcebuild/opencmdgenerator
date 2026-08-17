import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, ArchSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): ArchSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<ArchSpec>[] = [
  {
    id: "show",
    label: "Show arch",
    summary: "Print architecture",
    commandExample: "arch",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: [],
    }),
  },
  {
    id: "help",
    label: "Show help",
    summary: "Show command help",
    commandExample: "arch --help",
    apply: (spec) => ({
      ...spec,
      flags: {
        help: true,
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<ArchSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
