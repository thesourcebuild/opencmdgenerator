import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, EgrepSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): EgrepSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<EgrepSpec>[] = [
  {
    id: "search",
    label: "Extended search",
    summary: "Extended search",
    commandExample: "egrep error app.log",
    apply: (spec) => ({ ...spec, flags: {}, args: ["error", "app.log"] }),
  },
  {
    id: "recursive",
    label: "Recursive search",
    summary: "Recursive search",
    commandExample: "egrep -r TODO src",
    apply: (spec) => ({
      ...spec,
      flags: {
        recursive: true,
      },
      args: ["TODO", "src"],
    }),
  },
];

export function getPreset(id: string): Preset<EgrepSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
