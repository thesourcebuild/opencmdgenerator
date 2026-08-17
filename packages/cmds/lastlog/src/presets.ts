import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, LastlogSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): LastlogSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<LastlogSpec>[] = [
  {
    id: "all",
    label: "All users",
    summary: "Show last logins",
    commandExample: "lastlog",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: [],
    }),
  },
  {
    id: "user",
    label: "One user",
    summary: "Show last login for a user",
    commandExample: "lastlog -u alice",
    apply: (spec) => ({
      ...spec,
      flags: {
        user: "alice",
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<LastlogSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
