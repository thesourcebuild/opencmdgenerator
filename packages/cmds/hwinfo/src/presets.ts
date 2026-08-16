import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, HwinfoSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): HwinfoSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<HwinfoSpec>[] = [
  {
    id: "short",
    label: "Short summary",
    summary: "Show a compact hardware summary",
    commandExample: "hwinfo --short",
    apply: (spec) => ({
      ...spec,
      flags: {
        short: true,
      },
      args: [],
    }),
  },
  {
    id: "network",
    label: "Network devices",
    summary: "Show network hardware",
    commandExample: "hwinfo --network",
    apply: (spec) => ({
      ...spec,
      flags: {
        network: true,
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<HwinfoSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
