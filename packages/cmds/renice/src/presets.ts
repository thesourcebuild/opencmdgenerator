import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, ReniceSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): ReniceSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<ReniceSpec>[] = [
  {
    id: "pid",
    label: "Renice PID",
    summary: "Renice PID",
    commandExample: "renice -p 10 1234",
    apply: (spec) => ({
      ...spec,
      flags: {
        pid: true,
      },
      args: ["10", "1234"],
    }),
  },
  {
    id: "user",
    label: "Renice user",
    summary: "Renice user",
    commandExample: "renice -u 5 alice",
    apply: (spec) => ({
      ...spec,
      flags: {
        user: true,
      },
      args: ["5", "alice"],
    }),
  },
];

export function getPreset(id: string): Preset<ReniceSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
