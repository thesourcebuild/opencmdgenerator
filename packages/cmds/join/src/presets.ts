import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, JoinSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): JoinSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<JoinSpec>[] = [
  {
    id: "basic",
    label: "Join files",
    summary: "Join two files",
    commandExample: "join left.txt right.txt",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["left.txt", "right.txt"],
    }),
  },
  {
    id: "csv",
    label: "CSV join",
    summary: "Join comma-separated files on the first field",
    commandExample: "join -1 1 -2 1 -t , left.csv right.csv",
    apply: (spec) => ({
      ...spec,
      flags: {
        separator: ",",
        field1: 1,
        field2: 1,
      },
      args: ["left.csv", "right.csv"],
    }),
  },
];

export function getPreset(id: string): Preset<JoinSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
