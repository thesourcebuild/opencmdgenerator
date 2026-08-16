import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, PasteSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): PasteSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<PasteSpec>[] = [
  {
    id: "side",
    label: "Side by side",
    summary: "Side by side",
    commandExample: "paste names.txt values.txt",
    apply: (spec) => ({ ...spec, flags: {}, args: ["names.txt", "values.txt"] }),
  },
  {
    id: "csv",
    label: "Comma delimited",
    summary: "Comma delimited",
    commandExample: "paste -d , names.txt values.txt",
    apply: (spec) => ({
      ...spec,
      flags: {
        delimiters: ",",
      },
      args: ["names.txt", "values.txt"],
    }),
  },
];

export function getPreset(id: string): Preset<PasteSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
