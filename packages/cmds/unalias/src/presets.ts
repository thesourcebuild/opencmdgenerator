import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, UnaliasSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): UnaliasSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<UnaliasSpec>[] = [
  {
    id: "one",
    label: "Remove one alias",
    summary: "Remove one alias",
    commandExample: "unalias ll",
    apply: (spec) => ({ ...spec, flags: {}, args: ["ll"] }),
  },
  {
    id: "all",
    label: "Remove all aliases",
    summary: "Remove all aliases",
    commandExample: "unalias -a",
    apply: (spec) => ({
      ...spec,
      flags: {
        all: true,
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<UnaliasSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
