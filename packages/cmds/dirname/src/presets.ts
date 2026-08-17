import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, DirnameSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): DirnameSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<DirnameSpec>[] = [
  {
    id: "path",
    label: "Path dirname",
    summary: "Print a path directory",
    commandExample: "dirname /usr/bin/node",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["/usr/bin/node"],
    }),
  },
  {
    id: "relative",
    label: "Relative dirname",
    summary: "Print a relative path directory",
    commandExample: "dirname src/index.ts",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["src/index.ts"],
    }),
  },
];

export function getPreset(id: string): Preset<DirnameSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
