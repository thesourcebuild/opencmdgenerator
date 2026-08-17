import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SdiffSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): SdiffSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<SdiffSpec>[] = [
  {
    id: "compare",
    label: "Compare files",
    summary: "Show a side-by-side diff",
    commandExample: "sdiff old.txt new.txt",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["old.txt", "new.txt"],
    }),
  },
  {
    id: "wide",
    label: "Wide diff",
    summary: "Use a wider side-by-side diff",
    commandExample: "sdiff -w 120 old.txt new.txt",
    apply: (spec) => ({
      ...spec,
      flags: {
        width: 120,
      },
      args: ["old.txt", "new.txt"],
    }),
  },
];

export function getPreset(id: string): Preset<SdiffSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
