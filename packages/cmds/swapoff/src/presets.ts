import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SwapoffSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): SwapoffSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<SwapoffSpec>[] = [
  {
    id: "file",
    label: "Disable swap",
    summary: "Disable a swap file",
    commandExample: "swapoff /swapfile",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["/swapfile"],
    }),
  },
  {
    id: "all",
    label: "Disable all",
    summary: "Disable all swap",
    commandExample: "swapoff -a",
    apply: (spec) => ({
      ...spec,
      flags: {
        all: true,
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<SwapoffSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
