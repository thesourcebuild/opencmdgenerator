import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, NlSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): NlSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<NlSpec>[] = [
  {
    id: "file",
    label: "Number lines",
    summary: "Number lines in a file",
    commandExample: "nl file.txt",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["file.txt"],
    }),
  },
  {
    id: "all",
    label: "Number all lines",
    summary: "Number every line",
    commandExample: "nl -b a file.txt",
    apply: (spec) => ({
      ...spec,
      flags: {
        bodyNumbering: "a",
      },
      args: ["file.txt"],
    }),
  },
];

export function getPreset(id: string): Preset<NlSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
