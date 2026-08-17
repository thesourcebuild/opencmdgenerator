import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, StringsSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): StringsSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<StringsSpec>[] = [
  {
    id: "binary",
    label: "Extract strings",
    summary: "Extract strings from a binary",
    commandExample: "strings binary.bin",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["binary.bin"],
    }),
  },
  {
    id: "long",
    label: "Long strings",
    summary: "Extract strings at least eight characters long",
    commandExample: "strings -n 8 binary.bin",
    apply: (spec) => ({
      ...spec,
      flags: {
        minLength: 8,
      },
      args: ["binary.bin"],
    }),
  },
];

export function getPreset(id: string): Preset<StringsSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
