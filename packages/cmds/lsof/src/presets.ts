import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, LsofSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): LsofSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<LsofSpec>[] = [
  {
    id: "port",
    label: "Port users",
    summary: "Show processes using port 80",
    commandExample: "lsof -i :80",
    apply: (spec) => ({
      ...spec,
      flags: {
        network: ":80",
      },
      args: [],
    }),
  },
  {
    id: "fast",
    label: "Fast network",
    summary: "Show port 443 without name resolution",
    commandExample: "lsof -i :443 -n -P",
    apply: (spec) => ({
      ...spec,
      flags: {
        noNames: true,
        noPorts: true,
        network: ":443",
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<LsofSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
