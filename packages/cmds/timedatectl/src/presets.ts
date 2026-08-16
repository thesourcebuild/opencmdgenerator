import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, TimedatectlSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): TimedatectlSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<TimedatectlSpec>[] = [
  {
    id: "status",
    label: "Show status",
    summary: "Show current time settings",
    commandExample: "timedatectl status",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["status"],
    }),
  },
  {
    id: "timezone",
    label: "Set timezone",
    summary: "Set a timezone",
    commandExample: "timedatectl set-timezone UTC",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["set-timezone", "UTC"],
    }),
  },
];

export function getPreset(id: string): Preset<TimedatectlSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
