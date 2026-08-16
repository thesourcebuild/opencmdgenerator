import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, LspciSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): LspciSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<LspciSpec>[] = [
  {
    id: "list",
    label: "List PCI devices",
    summary: "List PCI devices",
    commandExample: "lspci",
    apply: (spec) => ({ ...spec, flags: {}, args: [] }),
  },
  {
    id: "drivers",
    label: "Kernel drivers",
    summary: "Kernel drivers",
    commandExample: "lspci -k",
    apply: (spec) => ({
      ...spec,
      flags: {
        kernel: true,
      },
      args: [],
    }),
  },
  {
    id: "numeric",
    label: "Numeric IDs",
    summary: "Numeric IDs",
    commandExample: "lspci -nn",
    apply: (spec) => ({
      ...spec,
      flags: {
        numeric: true,
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<LspciSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
