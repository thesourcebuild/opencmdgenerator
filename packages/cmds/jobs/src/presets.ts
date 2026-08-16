import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, JobsSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): JobsSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<JobsSpec>[] = [
  {
    id: "list",
    label: "List jobs",
    summary: "List jobs",
    commandExample: "jobs",
    apply: (spec) => ({ ...spec, flags: {}, args: [] }),
  },
  {
    id: "long",
    label: "Long listing",
    summary: "Long listing",
    commandExample: "jobs -l",
    apply: (spec) => ({
      ...spec,
      flags: {
        long: true,
      },
      args: [],
    }),
  },
  {
    id: "pids",
    label: "PID only",
    summary: "PID only",
    commandExample: "jobs -p",
    apply: (spec) => ({
      ...spec,
      flags: {
        pids: true,
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<JobsSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
