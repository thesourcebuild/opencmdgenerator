import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, RealpathSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): RealpathSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<RealpathSpec>[] = [
  {
    id: "resolve",
    label: "Resolve path",
    summary: "Resolve a path",
    commandExample: "realpath ./src/../README.md",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["./src/../README.md"],
    }),
  },
  {
    id: "relative",
    label: "Relative path",
    summary: "Resolve relative to a directory",
    commandExample: "realpath --relative-to /repo /repo/src/index.ts",
    apply: (spec) => ({
      ...spec,
      flags: {
        relativeTo: "/repo",
      },
      args: ["/repo/src/index.ts"],
    }),
  },
];

export function getPreset(id: string): Preset<RealpathSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
