import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, LtraceSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): LtraceSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<LtraceSpec>[] = [
  {
    id: "command",
    label: "Trace command",
    summary: "Trace library calls from a command",
    commandExample: "ltrace ./app",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["./app"],
    }),
  },
  {
    id: "attach",
    label: "Attach PID",
    summary: "Attach to a running process",
    commandExample: "ltrace -p 1234",
    apply: (spec) => ({
      ...spec,
      flags: {
        pid: 1234,
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<LtraceSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
