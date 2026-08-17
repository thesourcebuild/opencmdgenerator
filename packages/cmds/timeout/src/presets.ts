import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, TimeoutSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): TimeoutSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<TimeoutSpec>[] = [
  {
    id: "limit",
    label: "Limit command",
    summary: "Limit a command to 10 seconds",
    commandExample: "timeout 10s sleep 30",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["10s", "sleep", "30"],
    }),
  },
  {
    id: "kill",
    label: "Kill after",
    summary: "Force kill after grace period",
    commandExample: "timeout -k 5s 10s sleep 30",
    apply: (spec) => ({
      ...spec,
      flags: {
        killAfter: "5s",
      },
      args: ["10s", "sleep", "30"],
    }),
  },
];

export function getPreset(id: string): Preset<TimeoutSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
