import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, LastSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): LastSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<LastSpec>[] = [
  {
    id: "recent",
    label: "Recent logins",
    summary: "Show recent login sessions",
    commandExample: "last -n 10",
    apply: (spec) => ({
      ...spec,
      flags: {
        limit: 10,
      },
      args: [],
    }),
  },
  {
    id: "user",
    label: "User logins",
    summary: "Show logins for one user",
    commandExample: "last alice",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["alice"],
    }),
  },
];

export function getPreset(id: string): Preset<LastSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
