import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, HostnameSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): HostnameSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<HostnameSpec>[] = [
  {
    id: "show",
    label: "Show hostname",
    summary: "Show hostname",
    commandExample: "hostname",
    apply: (spec) => ({ ...spec, flags: {}, args: [] }),
  },
  {
    id: "fqdn",
    label: "Show FQDN",
    summary: "Show FQDN",
    commandExample: "hostname -f",
    apply: (spec) => ({
      ...spec,
      flags: {
        fqdn: true,
      },
      args: [],
    }),
  },
  {
    id: "set",
    label: "Set hostname",
    summary: "Set hostname",
    commandExample: "hostname web01",
    apply: (spec) => ({ ...spec, flags: {}, args: ["web01"] }),
  },
];

export function getPreset(id: string): Preset<HostnameSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
