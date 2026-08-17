import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, DisownSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): DisownSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<DisownSpec>[] = [
  {
    id: "job",
    label: "Disown job",
    summary: "Disown a job",
    commandExample: "disown %1",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["%1"],
    }),
  },
  {
    id: "all",
    label: "Disown all",
    summary: "Disown all jobs",
    commandExample: "disown -a",
    apply: (spec) => ({
      ...spec,
      flags: {
        all: true,
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<DisownSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
