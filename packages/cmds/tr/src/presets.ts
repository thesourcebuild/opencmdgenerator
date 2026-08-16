import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, TrSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): TrSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<TrSpec>[] = [
  {
    id: "upper",
    label: "Uppercase text",
    summary: "Uppercase text",
    commandExample: "tr a-z A-Z",
    apply: (spec) => ({ ...spec, flags: {}, args: ["a-z", "A-Z"] }),
  },
  {
    id: "delete",
    label: "Delete digits",
    summary: "Delete digits",
    commandExample: "tr -d 0-9",
    apply: (spec) => ({
      ...spec,
      flags: {
        delete: true,
      },
      args: ["0-9"],
    }),
  },
];

export function getPreset(id: string): Preset<TrSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
