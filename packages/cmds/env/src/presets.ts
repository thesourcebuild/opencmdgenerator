import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, EnvSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): EnvSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<EnvSpec>[] = [
  {
    id: "print",
    label: "Print env",
    summary: "Print environment variables",
    commandExample: "env",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: [],
    }),
  },
  {
    id: "clean",
    label: "Clean env",
    summary: "Run a command with an empty environment",
    commandExample: "env -i FOO=bar command",
    apply: (spec) => ({
      ...spec,
      flags: {
        ignore: true,
      },
      args: ["FOO=bar", "command"],
    }),
  },
];

export function getPreset(id: string): Preset<EnvSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
