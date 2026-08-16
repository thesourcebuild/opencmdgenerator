import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SsSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): SsSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<SsSpec>[] = [
  {
    id: "tcp",
    label: "Listening TCP",
    summary: "Listening TCP",
    commandExample: "ss -t -l -n",
    apply: (spec) => ({
      ...spec,
      flags: {
        tcp: true,
        listening: true,
        numeric: true,
      },
      args: [],
    }),
  },
  {
    id: "processes",
    label: "All with processes",
    summary: "All with processes",
    commandExample: "ss -a -p",
    apply: (spec) => ({
      ...spec,
      flags: {
        all: true,
        processes: true,
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<SsSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
