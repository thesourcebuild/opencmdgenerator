import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, TacSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): TacSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<TacSpec>[] = [
  {
    id: "reverse",
    label: "Reverse file",
    summary: "Reverse file",
    commandExample: "tac log.txt",
    apply: (spec) => ({ ...spec, flags: {}, args: ["log.txt"] }),
  },
  {
    id: "separator",
    label: "Custom separator",
    summary: "Custom separator",
    commandExample: "tac -s --- entries.txt",
    apply: (spec) => ({
      ...spec,
      flags: {
        separator: "---",
      },
      args: ["entries.txt"],
    }),
  },
];

export function getPreset(id: string): Preset<TacSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
