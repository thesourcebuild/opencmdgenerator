import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, RmmodSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): RmmodSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<RmmodSpec>[] = [
  {
    id: "remove",
    label: "Remove module",
    summary: "Remove a kernel module",
    commandExample: "rmmod br_netfilter",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["br_netfilter"],
    }),
  },
  {
    id: "verbose",
    label: "Verbose remove",
    summary: "Remove with verbose output",
    commandExample: "rmmod -v br_netfilter",
    apply: (spec) => ({
      ...spec,
      flags: {
        verbose: true,
      },
      args: ["br_netfilter"],
    }),
  },
];

export function getPreset(id: string): Preset<RmmodSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
