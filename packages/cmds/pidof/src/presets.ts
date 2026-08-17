import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, PidofSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): PidofSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<PidofSpec>[] = [
  {
    id: "program",
    label: "Find program",
    summary: "Find PIDs for a program",
    commandExample: "pidof sshd",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["sshd"],
    }),
  },
  {
    id: "single",
    label: "Single PID",
    summary: "Return one PID",
    commandExample: "pidof -s nginx",
    apply: (spec) => ({
      ...spec,
      flags: {
        single: true,
      },
      args: ["nginx"],
    }),
  },
];

export function getPreset(id: string): Preset<PidofSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
