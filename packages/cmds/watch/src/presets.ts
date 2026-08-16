import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, WatchSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): WatchSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<WatchSpec>[] = [
  {
    id: "disk",
    label: "Watch disk",
    summary: "Watch disk usage",
    commandExample: "watch -n 2 'df -h'",
    apply: (spec) => ({
      ...spec,
      flags: {
        interval: 2,
      },
      args: ["df -h"],
    }),
  },
  {
    id: "processes",
    label: "Watch processes",
    summary: "Watch process list",
    commandExample: "watch -d 'ps aux'",
    apply: (spec) => ({
      ...spec,
      flags: {
        differences: true,
      },
      args: ["ps aux"],
    }),
  },
];

export function getPreset(id: string): Preset<WatchSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
