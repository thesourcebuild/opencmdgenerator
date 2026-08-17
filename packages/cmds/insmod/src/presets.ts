import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, InsmodSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): InsmodSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<InsmodSpec>[] = [
  {
    id: "insert",
    label: "Insert module",
    summary: "Insert a kernel module",
    commandExample: "insmod module.ko",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["module.ko"],
    }),
  },
  {
    id: "params",
    label: "With params",
    summary: "Insert module with parameters",
    commandExample: "insmod module.ko debug=1",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["module.ko", "debug=1"],
    }),
  },
];

export function getPreset(id: string): Preset<InsmodSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
