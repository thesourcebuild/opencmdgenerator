import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, LscpuSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): LscpuSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<LscpuSpec>[] = [
  {
    id: "summary",
    label: "CPU summary",
    summary: "CPU summary",
    commandExample: "lscpu",
    apply: (spec) => ({ ...spec, flags: {}, args: [] }),
  },
  {
    id: "json",
    label: "JSON output",
    summary: "JSON output",
    commandExample: "lscpu -J",
    apply: (spec) => ({
      ...spec,
      flags: {
        json: true,
      },
      args: [],
    }),
  },
  {
    id: "extended",
    label: "Extended table",
    summary: "Extended table",
    commandExample: "lscpu -e",
    apply: (spec) => ({
      ...spec,
      flags: {
        extended: true,
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<LscpuSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
