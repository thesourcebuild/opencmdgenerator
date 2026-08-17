import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, HostSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): HostSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<HostSpec>[] = [
  {
    id: "lookup",
    label: "Lookup name",
    summary: "Lookup a hostname",
    commandExample: "host example.com",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["example.com"],
    }),
  },
  {
    id: "mx",
    label: "MX lookup",
    summary: "Lookup MX records",
    commandExample: "host -t MX example.com",
    apply: (spec) => ({
      ...spec,
      flags: {
        type: "MX",
      },
      args: ["example.com"],
    }),
  },
];

export function getPreset(id: string): Preset<HostSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
