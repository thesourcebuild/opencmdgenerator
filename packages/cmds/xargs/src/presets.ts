import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, XargsSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): XargsSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<XargsSpec>[] = [
  {
    id: "null",
    label: "Null input",
    summary: "Null input",
    commandExample: "xargs -0 rm -f",
    apply: (spec) => ({
      ...spec,
      flags: {
        null: true,
      },
      args: ["rm", "-f"],
    }),
  },
  {
    id: "one",
    label: "One item per command",
    summary: "One item per command",
    commandExample: "xargs -n 1 echo",
    apply: (spec) => ({
      ...spec,
      flags: {
        maxArgs: 1,
      },
      args: ["echo"],
    }),
  },
];

export function getPreset(id: string): Preset<XargsSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
