import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, MkswapSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): MkswapSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<MkswapSpec>[] = [
  {
    id: "file",
    label: "Make swap",
    summary: "Initialize a swap file",
    commandExample: "mkswap /swapfile",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["/swapfile"],
    }),
  },
  {
    id: "label",
    label: "Label swap",
    summary: "Initialize swap with a label",
    commandExample: "mkswap -L SWAP /swapfile",
    apply: (spec) => ({
      ...spec,
      flags: {
        label: "SWAP",
      },
      args: ["/swapfile"],
    }),
  },
];

export function getPreset(id: string): Preset<MkswapSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
